'use server';

interface SoilRecommendation {
    status: string;
    impact: string;
    adjustments: string;
    management: string;
}

export async function getSoilSuggestions(phValue: string): Promise<string> {
    const ph = parseFloat(phValue);
    
    const getSoilStatus = (ph: number): SoilRecommendation => {
        if (ph < 5.5) {
            return {
                status: "Strongly Acidic",
                impact: "Limited nutrient availability, especially phosphorus, calcium, and magnesium",
                adjustments: "Add agricultural lime to raise pH. Apply 50-100 pounds per 1000 sq ft",
                management: "Use acid-tolerant crops, monitor soil regularly, add organic matter"
            };
        } else if (ph >= 5.5 && ph < 6.5) {
            return {
                status: "Moderately Acidic",
                impact: "Good for most crops but some nutrients may be limited",
                adjustments: "Light liming may be beneficial. Add 25-50 pounds per 1000 sq ft",
                management: "Regular soil testing, balanced fertilization, crop rotation"
            };
        } else if (ph >= 6.5 && ph < 7.5) {
            return {
                status: "Neutral - Optimal",
                impact: "Ideal for nutrient availability and microbial activity",
                adjustments: "Maintain current levels. No immediate action needed",
                management: "Annual soil testing, organic matter addition, proper irrigation"
            };
        } else {
            return {
                status: "Alkaline",
                impact: "May limit availability of iron, manganese, and phosphorus",
                adjustments: "Add sulfur or acidifying fertilizers to lower pH",
                management: "Choose alkaline-tolerant crops, monitor micronutrient levels"
            };
        }
    };

    const recommendation = getSoilStatus(ph);
    
    return `
Soil Analysis for pH ${phValue}:
• Status: ${recommendation.status}
• Impact: ${recommendation.impact}
• Recommended Adjustments: ${recommendation.adjustments}
• Management Practices: ${recommendation.management}

Note: These are general guidelines. Consult with local agricultural experts for specific recommendations based on your crop and soil conditions.
    `.trim();
}