export const logAnalysis = (message: string, data?: unknown) => {
  console.log(`[AI-Analysis] ${message}`, data ?? "");
};
