import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import './PricingSection.css';

const PricingSection = () => {
  const whatsappUrl = 'https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0';
  
  const plans = [
    {
      name: "Starter",
      description: "Perfect for freelancers and solopreneurs",
      price: "AED 499",
      period: "/mo",
      transactions: "Up to 50 transactions/year",
      features: [
        "Annual Tax Filing",
        "Tax Registration",
        "Basic Financial Statements",
        "Dedicated Support Manager",
        "30 Min Free Consultation",
      ],
      popular: false,
    },
    {
      name: "Essential",
      description: "Ideal for growing small businesses",
      price: "AED 799",
      period: "/mo",
      transactions: "Up to 200 transactions/year",
      features: [
        "Everything in Starter, plus:",
        "Monthly Account Reconciliation",
        "Quarterly Accounting Reports",
        "Priority Support",
        "Expense Categorization",
        "Financial Health Check-up",
      ],
      popular: false,
    },
    {
      name: "Growth",
      description: "For businesses with higher volume",
      price: "AED 999",
      period: "/mo",
      transactions: "Up to 2,000 transactions/year",
      features: [
        "Everything in Essential, plus:",
        "Quarterly Bookkeeping",
        "Cash Flow Analysis",
        "Profit & Loss Statements",
        "Multi-currency Support",
        "Dedicated Account Manager",
      ],
      popular: true,
    },
    {
      name: "Scale",
      description: "Enterprise-grade financial management",
      price: "AED 1,999",
      period: "/mo",
      transactions: "Up to 3,600 transactions/year",
      features: [
        "Everything in Growth, plus:",
        "Monthly Bookkeeping",
        "Advanced Reporting Suite",
        "Custom Dashboard",
        "API Integrations",
        "CFO Advisory Services",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-wider text-primary font-semibold">Simple Pricing</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4">
            Transparent Plans for Every <span className="text-primary">Business</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            Best prices in the market. No hidden fees. Cancel anytime.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
            🎉 Pay Only if Satisfied — No Commitment!
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative card-gradient rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? "border-primary shadow-lg glow-orange" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

              <div className="mb-4">
                <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <p className="text-sm text-primary font-medium mb-6">{plan.transactions}</p>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full data-wa-track"
              >
                <Button 
                  className={`w-full ${plan.popular ? "shadow-button" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
