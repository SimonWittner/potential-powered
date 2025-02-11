
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "email": "Email",
    "password": "Password",
    
    // Company Info
    "companyName": "Company Name",
    "enterCompanyName": "Enter your company name",
    "address": "Address",
    "enterAddress": "Enter your address",
    
    // Consumption Form
    "analyze": "Analyze",
    "analyzing": "Analyzing...",
    "loadProfileUpload": "Load Profile Upload",
    "dragDropCsv": "Drag and drop your CSV file here, or click to select",
    "csvRequirement": "File must contain a single column with 8760 values in kW",
    "existingPV": "Do you have an existing PV?",
    "yes": "Yes",
    "no": "No",
    "pvSize": "PV Size",
    "enterSizeKwp": "Enter size in kWp",
    "loadProfileAfterPV": "Load profile after PV generation (net metering with existing PV)?",
    "electricityPrice": "Do you know your electricity price?",
    "enterPriceKwh": "Enter price in €/kWh",
    "gridPowerCharges": "Grid Power Charges",
    "enterPriceKwMonth": "Enter price in €/kW/month",
    
    // Results Page
    "back": "Back",
    "analysisResults": "Analysis Results",
    "loadProfileAnalysis": "Load Profile Analysis",
    "pvDesign": "PV Design",
    "batteryDesign": "Battery Design",
    "comparison": "Comparison",
    "economics": "Economics",
    "esgReporting": "ESG Reporting",
    "exportAnalysis": "Export Analysis",

    // Battery Design
    "recommendedBattery": "Recommended Battery",
    "additionalSelfConsumption": "Additional Self-consumption",
    "estimatedFullCycles": "Estimated Full Cycles per Year",
    "scenarioComparison": "Scenario Comparison",
    "maxProfitability": "Max. Profitability",
    "maxSelfConsumption": "Max. Self-Consumption",
    "size": "Size",

    // Economics
    "initialInvestment": "Initial Investment",
    "batterySystem": "Battery System",
    "savings": "Savings",
    "simplePaybackTime": "Simple Payback Time",
    "yearlyGridSavings": "Yearly Grid Power Charge Savings (Savings Peak Reduction)",
    "yearlyElectricitySavings": "Yearly Electricity Price Savings",
    "totalYearlySavings": "Total Yearly Savings",
    "netPresentValue": "Net Present Value",
    "years": "years",
    "loading": "Loading",

    // ESG
    "environmentalImpact": "Environmental Impact",
    "co2Reduction": "CO₂ Reduction",
    "equivalentTrees": "Equivalent Trees Planted",
    "loadingEsgData": "Loading ESG data..."
  },
  de: {
    // Auth
    "signIn": "Anmelden",
    "signUp": "Registrieren",
    "email": "E-Mail",
    "password": "Passwort",
    
    // Company Info
    "companyName": "Firmenname",
    "enterCompanyName": "Geben Sie Ihren Firmennamen ein",
    "address": "Adresse",
    "enterAddress": "Geben Sie Ihre Adresse ein",
    
    // Consumption Form
    "analyze": "Analysieren",
    "analyzing": "Analysiere...",
    "loadProfileUpload": "Lastprofil-Upload",
    "dragDropCsv": "CSV-Datei hier ablegen oder zum Auswählen klicken",
    "csvRequirement": "Datei muss eine einzelne Spalte mit 8760 Werten in kW enthalten",
    "existingPV": "Haben Sie bereits eine PV-Anlage?",
    "yes": "Ja",
    "no": "Nein",
    "pvSize": "PV-Größe",
    "enterSizeKwp": "Größe in kWp eingeben",
    "loadProfileAfterPV": "Lastprofil nach PV-Erzeugung (Netzeinspeisung mit bestehender PV)?",
    "electricityPrice": "Kennen Sie Ihren Strompreis?",
    "enterPriceKwh": "Preis in €/kWh eingeben",
    "gridPowerCharges": "Netzentgelte",
    "enterPriceKwMonth": "Preis in €/kW/Monat eingeben",
    
    // Results Page
    "back": "Zurück",
    "analysisResults": "Analyseergebnisse",
    "loadProfileAnalysis": "Lastprofilanalyse",
    "pvDesign": "PV-Design",
    "batteryDesign": "Batteriedesign",
    "comparison": "Vergleich",
    "economics": "Wirtschaftlichkeit",
    "esgReporting": "ESG-Bericht",
    "exportAnalysis": "Analyse exportieren",

    // Battery Design
    "recommendedBattery": "Empfohlene Batterie",
    "additionalSelfConsumption": "Zusätzlicher Eigenverbrauch",
    "estimatedFullCycles": "Geschätzte Vollzyklen pro Jahr",
    "scenarioComparison": "Szenariovergleich",
    "maxProfitability": "Max. Wirtschaftlichkeit",
    "maxSelfConsumption": "Max. Eigenverbrauch",
    "size": "Größe",

    // Economics
    "initialInvestment": "Anfangsinvestition",
    "batterySystem": "Batteriesystem",
    "savings": "Einsparungen",
    "simplePaybackTime": "Einfache Amortisationszeit",
    "yearlyGridSavings": "Jährliche Netzentgelteinsparungen (Spitzenlastreduktion)",
    "yearlyElectricitySavings": "Jährliche Strompreiseinsparungen",
    "totalYearlySavings": "Gesamte jährliche Einsparungen",
    "netPresentValue": "Kapitalwert",
    "years": "Jahre",
    "loading": "Laden",

    // ESG
    "environmentalImpact": "Umweltauswirkungen",
    "co2Reduction": "CO₂-Reduktion",
    "equivalentTrees": "Äquivalente gepflanzte Bäume",
    "loadingEsgData": "Lade ESG-Daten..."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
