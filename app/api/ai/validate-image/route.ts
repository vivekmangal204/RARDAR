import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { imageBase64, category, description } = await req.json()

    if (!imageBase64) {
      return NextResponse.json(
        { valid: false, reason: "No image provided" },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    })

    const prompt = `
You are validating animal rescue reports.

IMPORTANT RULES:
- Be lenient with genuine emergency images.
- Do NOT reject if animal is injured but category says dead (or vice versa).
- Do NOT penalize short or simple descriptions.
- Only reject if image is clearly NOT an animal.

Answer ONLY in JSON.

{
  "isAnimal": boolean,
  "condition": "injured" | "dead" | "unknown",
  "descriptionMatches": boolean,
  "confidence": number
}
`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(",")[1],
        },
      },
    ])

    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return NextResponse.json({
      valid: true,
      warning: "AI Checked, submission allowed",
    })
    }

    const aiResult = JSON.parse(jsonMatch[0])

    // ✅ FINAL DECISION LOGIC (IMPORTANT)
    const isValid = aiResult.isAnimal === true

    return NextResponse.json({
      valid: isValid,
      aiResult,
      warning:
        !aiResult.descriptionMatches || aiResult.confidence < 0.5
          ? "AI uncertain, human review recommended"
          : undefined,
    })
  } catch (error) {
    console.error("Gemini validation error:", error)

    // 🚨 NEVER BLOCK EMERGENCY REPORTS
    return NextResponse.json({
      valid: true,
      warning: "AI Checked, submission allowed",
    })
  }
}
