# EGAT Energy Feasibility Platform

A web tool for checking whether an energy project is worth investing in for a factory customer. It covers three products that EGAT offers to commercial and industrial customers:

- Solar PPA
- Solar + Battery (BESS) PPA
- Battery (BESS) PPA

You enter the customer's electricity bill, answers from a short questionnaire and the project costs. The platform then calculates NPV, IRR, payback and LCOE, and shows how much the customer saves compared with their current bill.

This was a group project between the College of Innovation, Thammasat University and EGAT (October to November 2026). It was delivered and presented to EGAT in November 2026.

![Overview](docs/overview-preview.jpg)

## The question we were answering

EGAT needed a quick way to see whether a customer is a good fit for each product before sending engineers to the site, and to know which numbers actually matter for the decision.

## Data

- A 16-question customer questionnaire (business type, operating hours, roof space, contract preferences and so on)
- 6 months of electricity bills from a real factory customer (a textile plant, kept anonymous in this repo)
- Market ranges for installation cost, battery price, solar yield, degradation and tariffs, collected from public sources (see `research_notes/`)

The bill and questionnaire answers are converted into the inputs the financial model needs, such as daytime load, peak and off-peak usage, demand charge and Ft rate. `domain/inputs.js` holds that conversion.

## What the sensitivity analysis found

Each input was moved across a realistic low to high range while everything else stayed the same, and the change in IRR and NPV was recorded. Using the real factory case:

- **Solar PPA:** installation cost is the biggest driver, explaining about 68% of the IRR swing. IRR ranges from 4.2% to 15.7% across the tested inputs, and the project drops below the model's 8% hurdle rate once installation cost goes above about 28 THB/W. The PPA discount given to the customer (16% of the swing) and solar yield per kWp (10%) come next.
- **Battery PPA:** battery price explains about 96% of the NPV swing. At today's prices (8,000 to 15,000 THB/kWh) the project does not reach the 8% hurdle. The price would need to fall to about 2,600 THB/kWh.
- **Solar + Battery:** solar installation cost (39%) and battery price (22%) both matter, so this product depends on both prices coming down.

In short, getting a good installation price matters more than anything about the customer's usage, and a battery on its own is not viable yet.

## Features

- Pick a product and manage several customer projects
- Dashboards for cumulative cash flow and payback, yearly cash flow, customer savings, sensitivity (tornado) and product comparison
- Accept or reject a project manually, or let the platform decide from the hurdle rate
- Sign in to save projects to the cloud (each user only sees their own), or use demo mode, which stores everything in the browser
- Export results to CSV

## How it is built

| Part | Files |
|---|---|
| Financial model (cash flow, NPV, IRR, payback, LCOE) | `domain/model.js`, `domain/finance.js`, `domain/bess.js` |
| Bill and questionnaire to model inputs | `domain/inputs.js`, `raw-inputs.js` |
| Real customer case and sensitivity ranges | `domain/khunTon.js`, `domain/khunTonData.js` |
| Charts | `charts.js` |
| App and landing page | `app.html`, `app.js`, `index.html`, `landing.js` |
| Storage (Supabase or browser) | `store.js`, `workspace-sync.js` |

The calculations follow EGAT's Excel feasibility model. The tests compare the platform's results with the same cases recalculated in Excel. Two things we found in the original workbook:

- The payback in the summary sheet is typed in by hand (4.57 and 7.12 years). Calculated from the workbook's own cash flows it should be 4.23 and 6.61 years.
- The battery installation cost always uses 500 kWh, even when the battery size changes. The platform uses the actual size.

Tech: JavaScript, Vite, Supabase (PostgreSQL with row-level security), Three.js for the 3D product models, deployed on Vercel.

## Running it locally

```sh
npm install
npm run dev     # http://localhost:5193
npm test
npm run build
```

To use sign-in and cloud saving, create `.env.local` with your own Supabase project:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Demo mode works without it.

## Note

The example figures are illustrative scenarios, not guaranteed returns.
