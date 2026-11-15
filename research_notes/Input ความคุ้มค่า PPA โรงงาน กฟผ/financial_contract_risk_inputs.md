# Financial, Tax, Contract and Risk Inputs for Appraising EGAT-Owned Behind-the-Meter C&I Solar/BESS (Solar PPA, Solar + Battery, Battery Only)

Scope note: Thailand/EGAT-specific facts are cited. Items marked "GLOBAL PRACTICE" are international conventions. Items in "Inferences" are the researcher's own reasoning or arithmetic (worked numbers are illustrative only, not sourced data). Research date: 2026-11-09.

---

## 1. Discount rate / hurdle rate (WACC, EGAT cost of debt, country risk, customer risk premium, real vs nominal)

### Takeaway
EGAT can borrow very cheaply. Its baht bonds carry 1.14–4.94% coupons, and a 5-year bond issued in Sept 2024 priced at 2.638%. Thailand's country risk premium is about 2.1% (Damodaran, Jan 2026). These numbers describe EGAT's sovereign-like credit, not the factory customer's credit. A behind-the-meter PPA hurdle rate therefore needs a project- or customer-specific risk premium on top of EGAT's WACC. The rate must also be stated consistently as nominal or real (Thai CPI is running about 1–2%).

### Cited Findings
- EGAT bonds outstanding at 31 Dec 2024 totalled about THB 102.6 bn, with interest rates of **1.14–4.94% p.a.** and maturities of 6–20 years. Domestic debentures (group) carry 1.76–4.26%, USD debentures 4.50%, JPY debentures 2.72%, and some bank loans float at 6-month BIBOR — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- On 23 Sept 2024 EGAT issued bonds B.E. 2567 No.3: THB 2,000 m, **5-year, 2.638% p.a.**, semi-annual coupons. They were a private placement to institutional investors, **not guaranteed by the Ministry of Finance**, and funded transmission investment — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- Consolidated finance costs were THB 46,950 m in 2024 (THB 43,378 m in 2023). The separate (parent) figure was THB 43,334 m — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- The ERC's financial criteria for EGAT state that "returns from investment must not exceed Weighted Average Cost of Capital (WACC)". ERC claws back or refunds revenue when EGAT's performance is above or below the threshold. EGAT's regulated core business is therefore return-capped at a WACC benchmark — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- EGAT issued a sustainability-linked bond, with subscription on 11–12 Sept 2025 and issue on 15 Sept 2025. The coupon was not found in accessible text — [Nation Thailand PR](https://www.nationthailand.com/pr-news/40053758)
- Another EGAT bond, EGAT303A, was reported at a 3% coupon with a weighted-average yield of 2.6763%. The issue date was not confirmed — [search snippet via cbonds/Nation; date unverified](https://www.nationthailand.com/news/30371776)
- Thai 1-year government bond yield was **1.25% p.a. in Dec 2025** (ThaiBMA data via CEIC) — [CEIC](https://www.dr.ceicdata.com/en/indicator/thailand/short-term-government-bond-yield)
- Bank of Thailand policy rate was **1.00%**, held on 28 Oct 2026 — [Nation Thailand](https://www.nationthailand.com/business/economy/40072832)
- Damodaran (dataset dated 5 Jan 2026): Thailand is rated **Baa1** (Moody's), with a default spread of **1.36%**, a **country risk premium of 2.07%** and a **total equity risk premium of 6.30%**. The implied mature-market ERP is 4.23% — [Damodaran, ctryprem](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html)
- An earlier Damodaran figure for Thailand's total ERP was 8.70% (as of 1 Jan 2023). This shows the input moves materially between editions — [GuruFocus citing Damodaran](https://m.gurufocus.com/economic_indicators/6027/thailand-total-equity-risk-premium)
- Damodaran revised his country-risk framework in 2026 after the US downgrade. The US implied ERP is no longer treated as a pure mature-market benchmark, so the edition used must be stated — [BVResources](https://www.bvresources.com/articles/bvwire/global-damodaran-revises-country-risk-framework-after-us-rating-downgrade)
- GLOBAL PRACTICE (ADB): project FIRR is compared with the WACC to judge financial viability. Economic NPV is computed at a minimum required EIRR, which was 12% in older ADB practice. The 2017 ADB Guidelines revised the minimum EIRR — [ADB financial analysis appendix](https://www.adb.org/sites/default/files/linked-documents/41626-01-ind-fa.pdf); [ADB Guidelines for the Economic Analysis of Projects (2017)](https://www.adb.org/documents/guidelines-economic-analysis-projects)
- GLOBAL PRACTICE (Philippines NEDA-ICC): FIRR should exceed WACC, and NPV at WACC should be > 0. Using the entity WACC is appropriate only when project risk matches the entity's overall business risk — [NEDA ICC Guidelines](https://depdev.gov.ph/wp-content/uploads/2013/10/ICC-Project-Evaluation-Procedures-and-Guidelines-as-of-24-June-2004.pdf)

### Inferences
- **Why a customer risk premium is needed.** EGAT's 2.6–3% cost of debt prices EGAT's quasi-sovereign credit. A C&I PPA's cash flows depend on one factory's willingness and ability to pay for 10–25 years. Thai SMEs show about a 9% NPL ratio versus about 1% for corporates (see Section 5). The ICC/ADB logic says the entity WACC is valid only if project risk equals entity risk, and here it does not. A defensible structure is: hurdle = EGAT WACC (or regulated WACC) + project/customer premium (for example +1 to +4 pp by customer rating tier). An alternative is to keep the base WACC and haircut cash flows explicitly for default. Do one or the other, never both.
- **Suggested build-up inputs:**

| Input | Unit | Typical value / how to set | Why it matters | Source |
|---|---|---|---|---|
| Risk-free rate (THB) | % nominal | Thai govt bond matched to tenor. 1-yr is 1.25% (Dec 2025); use the 10–20-yr ThaiBMA curve for 15–25-yr PPAs | Base of all rates | CEIC/ThaiBMA |
| EGAT pre-tax cost of debt | % nominal | ~2.6–3.5% for new 5–10-yr issues; range 1.14–4.94% on stock | Debt leg of WACC; financing cost if project-financed | EGAT FS 2024 |
| Cost of equity / required return on state capital | % nominal | Rf + β×ERP (ERP 6.30% incl. CRP 2.07%), or a สคร./MoF-prescribed rate if one exists | Equity leg | Damodaran Jan 2026 |
| Target capital structure | % D/E | EGAT corporate or project-specific (for example 50–70% debt) | Weights WACC | Assumption |
| Customer/project risk premium | pp | +1–4 pp by credit tier (inference) | Prices factory default/closure risk | Inference |
| Inflation assumption (for real/nominal conversion) | % p.a. | 1.3–2.1% (BOT 2026–27) | Fisher consistency | BOT |

- **Numeric impact (illustrative arithmetic).** The PV of a flat 20-year annuity of 1 THB/yr is 13.59 at 4%, 11.47 at 6%, 9.13 at 9% and 7.47 at 12%. Moving the hurdle from 6% to 9% cuts the PV of operating cash flows by about 20%. Moving from 6% to 12% cuts it by about 35%. For a thin-margin PPA priced at a 10–20% discount to tariff, this alone can flip NPV sign. The discount rate is typically the #1 or #2 bar on a tornado chart.
- **Real vs nominal.** If the tariff and O&M are escalated in nominal terms, discount at a nominal rate. With 1.5% inflation, a 7.6% nominal rate ≈ 6.0% real, from (1.076/1.015)−1. A common error is to discount flat (real) PEA tariffs at a nominal WACC. This understates NPV, while escalating revenues and using a real rate overstates it.
- The ERC WACC cap on EGAT's regulated business suggests that, for a commercial (non-regulated) product, EGAT management should set a separate hurdle at or above regulated WACC. Otherwise the new business could earn less than the regulated core.

### Gaps
- No official สคร. (SEPO) or NESDC (สศช.) document stating a prescribed discount rate, hurdle rate or social discount rate for Thai state-enterprise commercial investments was found. Searches in Thai and English returned only ADB/Philippine documents. The project manager should request EGAT's internal Investment Policy / hurdle-rate memo and the ERC-approved WACC figure, which was not found publicly.
- The exact coupon of EGAT's Sept 2025 sustainability-linked bond and the current ThaiBMA 10–20-yr government yields were not retrieved.
- The ADB 2017 minimum EIRR values (widely cited as 9% general / 6% for some social sectors) could not be verified from the retrieved text.
- No published beta for Thai utilities or IPPs was retrieved.

---

## 2. Tax treatment: EGAT CIT status, profit remittance (เงินนำส่งรัฐ), depreciation, VAT, BOI

### Takeaway
EGAT the parent pays **no corporate income tax**: separate-entity income tax expense is zero in 2023–2024. Instead it **remits 45% of net profit before bonus to the Ministry of Finance** (50% in 2023). EGAT subsidiaries, however, are CIT-payers. So the tax line in the model depends on **which legal entity owns the assets**: EGAT parent (tax = 0) or an EGAT subsidiary/JV (Thai CIT applies, and tax depreciation and BOI then matter). BOI's 2025 solar/BESS measure gives a 3-year CIT holiday capped at 50% of investment. It mainly benefits the factory's own investment, which is EGAT's competing "buy outright" alternative.

### Cited Findings
- EGAT 2024 statements: separate (parent) **income tax expense = 0** in both 2024 and 2023. Consolidated income tax expense was THB 1,629 m (2024) and THB 1,380 m (2023), arising in subsidiaries. Consolidated cash paid for income tax was THB 1,341 m; the separate figure was nil — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- The EGAT 2006 financial report states "As a state enterprise, EGAT is exempted from the corporate income tax" — [EGAT Financial Statements 2006](https://www.egat.co.th/home/en/wp-content/uploads/2021/12/EGAT-Financial-Statements-2006.pdf)
- EGAT subsidiaries became liable to income tax from 31 Oct 2008 — [EGAT Annual Report 2009](https://www.egat.co.th/home/en/wp-content/uploads/2021/12/annualReport-2009.pdf)
- The **Ministry of Finance prescribed that EGAT remit 45% (2023: 50%) of net profit for the year before bonus expense** (separate statements). This "might vary depending on the revision of the Ministry of Finance". Accrued remittance added was THB 21,335 m in 2024 and THB 28,386 m in 2023. THB 32,849 m was paid in 2024 — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf); 2023 rate of 50% confirmed in [EGAT Financial Statements 2023](https://www.egat.co.th/home/en/wp-content/uploads/2024/09/EGAT-Financial-Statements-2023.pdf)
- Historical remittance rates: 40% of net income before bonus in 2007 — [EGAT FS 2007](https://www.egat.co.th/home/en/wp-content/uploads/2021/12/EGAT-Financial-Statements-2007.pdf); about 45% in 2020 — [EGAT Annual Report 2020](https://www.egat.co.th/home/en/wp-content/uploads/2021/12/annual-report-2020-en.pdf)
- สคร. (SEPO) collects remittances from state enterprises. The FY2568 (2025) collection target was THB 176,500 m. EGAT was #1 remitter in Q1 FY2563 at >THB 18,000 m — [ThaiPublica](https://thaipublica.org/2020/01/state-enterprise-7-1-2563/); [data.go.th remittance-rate dataset](https://data.go.th/en/dataset/dataset_21_023)
- EGAT accounting depreciation is straight-line. Useful lives: power plant, machinery and equipment 2–45 years; electrical control system 3–25 years; other equipment 3–20 years — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- Thai tax depreciation is governed by Royal Decree No. 145 (B.E. 2527) under Revenue Code s.65 bis(2), as amended by RDs 200, 395, 473 and 537. A taxpayer cannot change depreciation method or rates outside the Decree without Director-General approval (Supreme Court Dika 3662/2540) — [Revenue Department](https://rd.go.th/16773.html); [rd.go.th RD amendments](https://rd.go.th/38890)
- **BOI Announcement No. 2/2568 (9 Apr 2025)**, the efficiency-enhancement measure for solar energy systems, superseding 12/2567:
  - Open to existing BOI and non-BOI projects investing ≥ THB 1 m.
  - Grants an import-duty exemption on machinery plus a **3-year CIT exemption on the revenue of the existing project, capped at 50% of investment**.
  - Eligible investment is capped at THB 12 m / 30 m / 40 m per MW depending on type.
  - Eligible items include PV modules, inverters, transformers, **BESS and BESS inverters**, and mounting installation.
  - Source: [LawPlus, 25 Jun 2025](https://www.lawplusltd.com/Newsletter/2025/Z004.0625.boi%20notification.Final.pdf)
- A secondary source claims BOI Announcement No. 3/2568 (Apr 2025) made on-grid solar without BESS or energy-saving upgrades ineligible. This is **unverified and may conflict** with LawPlus's reading of 2/2568 — [Energreen](https://energreenasia.com/energreen-powering-thailands-sustainable-future-with-solar-ess-ev-charging/)
- Rooftop solar installations no longer require a factory licence, which removes a permitting cost and delay — [Tilleke & Gibbins](https://www.tilleke.com/insights/thailand-removes-factory-license-requirement-for-solar-rooftop-installations)

### Inferences
- **How to model tax for EGAT-parent ownership:** set CIT = 0. The 45% remittance is a **distribution of profit to the owner (the state), analogous to a dividend**, not a project-level cost. It should therefore **not** be deducted from project cash flows when computing project NPV/IRR. Deducting it would double-count the owner's return. It matters only for EGAT corporate cash-planning (retained cash available to reinvest is ~55% of profit).
  - Alternative view for a Treasury-perspective appraisal: compare the PPA's after-remittance contribution with the MoF's opportunity cost. This should be flagged as a policy choice for the investment committee.
- **If ownership sits in a subsidiary/SPV** (EGAT subsidiaries are taxable): include Thai CIT at the standard rate (generally 20%; not re-verified in this research). Use tax depreciation per RD 145 (the ceiling rate for machinery is commonly cited as 20%/yr straight-line, i.e. 5 years; not verified here), loss carry-forward (commonly 5 years; not verified here) and possibly the BOI incentive. A 5-year tax write-off versus 20–25-year book life front-loads tax shields and raises IRR versus book-life depreciation.
- **Model inputs:**

| Input | Unit | EGAT parent | Subsidiary/SPV | Why it matters |
|---|---|---|---|---|
| CIT rate | % | 0% | Thai standard CIT (verify; generally 20%) | After-tax cash flow |
| Profit remittance | % of net profit | 45% (2024), variable | n/a (dividends to EGAT) | Corporate cash only; exclude from project NPV |
| Tax depreciation life/method | years / SL | Not applicable | RD 145 ceiling rates (verify) | Timing of tax shield |
| Book depreciation life | years | PV 20–25, BESS 10–15 (within EGAT 2–45 / 3–25 yr policy) | same | Accounting profit, remittance base, LCOE presentation |
| BOI CIT holiday | years / cap | Not applicable (already exempt) | Possibly 3 yrs, cap 50% of capex, if eligible | Only if SPV qualifies |
| VAT on PPA invoices | % | Thai VAT on electricity sales (rate not verified here) | same | Working capital and price comparability vs PEA bill |
| Import duty on equipment | % | Check; BOI exemption only for BOI promotees | same | Capex |

- **Competitive implication:** a factory buying its own system can claim BOI's 3-year CIT holiday (up to 50% of capex). A PPA discount must therefore beat the factory's self-ownership economics, including that tax benefit. This sets a ceiling on how much EGAT can charge.
- VAT: the PPA price should be quoted ex-VAT and compared with the PEA/MEA bill ex-VAT. VAT is usually a pass-through for a VAT-registered factory, but it affects billing cash timing.

### Gaps
- The exact legal basis of EGAT's CIT exemption (Revenue Code definition of "company or juristic partnership" vs the EGAT Act B.E. 2511) was not retrieved from a primary text.
- RD 145 depreciation ceiling rates for machinery/solar/BESS and any specific Revenue Department ruling on rooftop PV and BESS were not verified. Thai VAT rate and treatment for private electricity sales, and loss carry-forward rules, were not verified in this session.
- Whether BOI Announcement 3/2568 removed solar-only eligibility (Energreen claim) is unconfirmed. The official BOI text was not retrieved.
- Whether an EGAT-owned behind-the-meter business would be housed in EGAT parent or a subsidiary (for example an EGAT/RATCH-style vehicle) is a structuring decision not found publicly.

---

## 3. Inflation inputs: CPI outlook, O&M escalation, tariff escalation link

### Takeaway
Thai headline inflation is low: the BOT projects 2.1% for 2026 and 1.3% for 2027, within a 1–3% target band. The bigger driver of PPA revenue is not CPI but the **PEA/MEA tariff path**, i.e. base tariff plus the Ft fuel-adjustment charge. The Ft is policy-driven and has recently been held down. Model tariff escalation separately from O&M escalation.

### Cited Findings
- BOT MPC (28 Oct 2026): headline inflation projected at **2.1% (2026) and 1.3% (2027)**. Energy prices and El Niño push inflation up into early 2027 — [Nation Thailand](https://www.nationthailand.com/business/economy/40072832)
- BOT MPC 3/2026 (24 Jun 2026): headline inflation was then forecast at 2.8% (2026) and 1.4% (2027). The decline in 2027 was attributed to fading supply-side pressures and a high 2026 base — [Bank of Thailand](https://www.bot.or.th/en/news-and-media/news/mpc/news-20260624-NVHKxr00.html)
- BOT expected inflation to return within the **1–3% target band** by early 2027. The 2027 forecast was revised 1.5% → 1.4% → 1.3% across 2026 — [Thailand Business News](https://www.thailand-business-news.com/banking/317246-thailand-mpc-holds-rate-at-1-0-lifts-2026-gdp-forecast-to-2-3)
- UOB (May 2026) forecast 2027 headline CPI at 1.2% — [TMGM/UOB](https://www.tmgm.com/en/analysis/market-news/article/thailand-cost-push-spike-steady-bot-rate-uob-202605071917)
- EGAT's own power-purchase contracts include cost components "adjusted to cover the changes of interest rates, Consumer Price Index" and other factors. CPI indexation is an established Thai PPA convention — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- Policy pressure on power prices: in 2026 the government moved to revisit legacy renewable PPAs. Automatic renewals end, and contracts get one further term at about THB 2.16/kWh. Renegotiated contracts get a fixed 20–25-year term — [Baker McKenzie, Jul 2026](https://www.bakermckenzie.com/en/insight/publications/2026/07/thailand-government-moves-to-revisit-legacy-renewable-ppas)

### Inferences
- **Inputs:**

| Input | Unit | Typical value | Why it matters |
|---|---|---|---|
| CPI (general inflation) | % p.a. | 1.3–2.1% near term; ~1.5–2.0% long-run (mid of 1–3% band) | Nominal/real conversion; O&M, insurance and labour escalation |
| O&M escalation | % p.a. | CPI or CPI + 0–1% (labour-heavy items) | 20–25 yrs of compounding |
| PEA/MEA tariff escalation (base + Ft) | % p.a. nominal | Scenario-based: flat nominal (conservative), CPI-linked (base), declining (stress) | Revenue = tariff × (1 − discount) for discount-to-tariff PPAs |
| Fixed-price escalator (if fixed-price PPA) | % p.a. | 0–2% contractual | Locks the revenue path; transfers tariff risk to the customer |
| BESS augmentation / replacement cost trend | % p.a. real | Declining (technology learning) | Year-10–12 battery replacement capex |

- **Numeric impact (illustrative).** Over 20 years, a 1.5%/yr tariff escalation versus flat nominal raises cumulative nominal revenue by about 23%. A tariff that falls 1%/yr ends about 18% lower by year 20. In a discount-to-tariff PPA, EGAT bears all of this. Hence the floor/ceiling price clause (Section 4).
- The 2026 government push to reprice legacy PPAs and keep tariffs down signals a **downside tariff scenario** that should be explicit in any discount-to-PEA-tariff model.

### Gaps
- No official long-term (10–25-yr) Thai tariff or Ft projection was found. ERC/EPPO tariff-path forecasts were not retrieved.
- No source on Thai O&M cost escalation rates specific to rooftop PV/BESS was found.

---

## 4. Contract terms that drive cash flows (tenor, pricing, take-or-pay, shared savings, termination/buyout, transfer, roof, guarantees, billing)

### Takeaway
Thai C&I rooftop PPAs are privately negotiated. Tenors cluster at **20–25 years**, with 10–15-year variants in the market but less documented. Pricing is usually a **discount to the PEA/MEA tariff**; one documented university deal was a 38.5% discount. The clauses that most change NPV are tenor, discount %/floor price, minimum offtake, early-termination/buyout payments, roof and relocation rights, mortgage/fixture protection, and payment security.

### Cited Findings
- Thai government-scheme solar PPAs typically run a fixed **25 years from COD** — [Baker McKenzie](https://www.bakermckenzie.com/en/insight/publications/2026/07/thailand-government-moves-to-revisit-legacy-renewable-ppas); **20 or 25 years** depending on scheme/technology — [Norton Rose Fulbright](https://www.nortonrosefulbright.com/en/knowledge/publications/2f5545da/asia-renewables-snapshot-thailand)
- Private rooftop examples:
  - PRIME ESCO signed a **25-year PPA for a 1.62 MW** rooftop project — [SolarQuarter](https://solarquarter.com/2023/11/01/prime-road-power-subsidiary-prime-esco-secures-25-year-ppa-for-1-62-mw-solar-project-in-thailand/)
  - The PRIME JV Walailak University rooftop gives a **38.50% discount versus the PEA rate** — [SolarQuarter](https://solarquarter.com/2024/03/01/prime-road-powers-joint-venture-secures-rooftop-solar-project-at-walailak-university-in-thailand/)
  - One developer (Sunsear) describes typical PPAs of **20 years** at a discount to PEA/MEA rates (per search summary of developer page)
  - SiS Distribution launched a private-PPA model in 2025; its tenor was not confirmed — [SolarQuarter](https://solarquarter.com/2025/07/25/sis-distribution-thailand-enters-solar-market-with-private-ppa-model-signs-first-deal-with-mplus-thai-sinsap)
- Tilleke & Gibbins on Thai private PPAs (2017):
  - Price is freely negotiable between private parties, unlike PEA/MEA/EGAT form PPAs.
  - The buyer should ideally commit to a **minimum monthly purchase**, paying even if consumption is lower, set realistically versus future use.
  - Address termination if shading (neighbouring buildings/trees) makes the system worthless.
  - The seller should not be able to terminate immediately for non-payment.
  - Late payment should trigger automatic interest.
  - The seller retains ownership: mark the equipment, register ownership, and prevent the system becoming a **fixture**.
  - Include a **negative covenant/notification on mortgages** of the building/land, because lenders may otherwise claim the system as collateral.
  - Confirm the lease term if the factory leases the premises.
  - Include **change-in-law** provisions as the ERC regime evolves.
  - Source: [Tilleke & Gibbins](https://www.tilleke.com/insights/seven-things-look-your-private-power-purchase-agreement/)

### Inferences
- **Contract input list for the model (values are typical-market conventions; Thai-specific citations where noted):**

| Input | Unit | Typical value | Why it matters / numeric impact |
|---|---|---|---|
| PPA tenor | years | 15–25 (Thai evidence 20–25) | Must be ≥ payback plus buffer. Revenue beyond tenor is uncertain, so model it as residual/renewal |
| Pricing basis | type | Discount % to PEA/MEA TOU tariff; fixed THB/kWh with escalator; hybrid with floor/ceiling | Determines who bears tariff risk |
| Discount to tariff | % | 10–30% typical (inference); up to 38.5% documented | Revenue ∝ (1−d). Moving from 10% to 20% discount cuts revenue 11.1% (0.80/0.90) and NPV by more, since costs are fixed |
| Floor price | THB/kWh | Set ≥ LCOE + margin | Protects against tariff cuts/Ft reductions |
| Ceiling/cap | THB/kWh | Optional | Customer protection; limits upside |
| Minimum offtake / take-or-pay | % of P50 yield or kWh/month | e.g. 80–100% of expected generation (inference) | Converts volume risk (factory shutdowns, weekends, curtailment) into a contractual payment |
| Deemed-energy clause | kWh | Paid when the customer curtails/blocks export or shades the roof | Protects revenue from customer-caused losses |
| Shared-savings split (BESS / battery-only) | % EGAT : % customer | e.g. 70:30 to 85:15 (inference) | BESS revenue = demand-charge + TOU-arbitrage savings × EGAT share. Measurement baseline drives disputes |
| Baseline methodology (shared savings) | text | Pre-install 12-month load profile; IPMVP-style M&V | Wrong baseline → revenue disputes |
| Early-termination / buyout schedule | THB by year | Declining schedule ≥ unrecovered capex + lost margin + breakage | Caps downside on customer exit; key credit-mitigation tool |
| End-of-term transfer | THB / option | Transfer at nominal THB 1, at fair market value, or removal at customer cost | Sets terminal value (0 vs salvage vs removal cost) |
| Roof access, relocation, re-roofing | days / cost allocation | Customer pays relocation; downtime treated as deemed energy | Avoids unpaid downtime |
| Performance guarantee (to customer) | % of P50 / PR | e.g. 90–95% of expected yield, with liquidated damages (inference) | Penalty cash outflow in poor years |
| Availability guarantee (BESS) | % | e.g. 95–98% (inference) | Shared-savings penalty exposure |
| Billing frequency / payment terms | days | Monthly; 30-day terms (inference) | Working capital, DSO |
| Late-payment interest | % p.a. | Contractual (Tilleke recommends automatic) | Deters arrears |
| Security package | months of billing | Bank guarantee/deposit of 3–6 months (inference); parent guarantee | Reduces loss-given-default |
| Mortgage / fixture protection | clause | Negative covenant, notification, equipment marking | Prevents loss of asset in factory insolvency |
| Change-in-law / tariff-reform clause | clause | Price reopener | ERC rule changes; government tariff interventions (2026 legacy PPA reset) |

- **Numeric impact of termination payment (illustrative).** Without a buyout schedule, a year-5 exit on a 20-year PPA forfeits roughly 60–65% of contract PV, depending on the rate. A buyout set at unrecovered capex plus a margin limits the loss to removal and re-deployment costs.

### Gaps
- No public Thai standard-form C&I PPA or recent (2023–2026) law-firm survey with specific numbers was found. The Tilleke article is from 2017. This covers market-standard minimum offtake %, buyout schedules, security deposits and performance-guarantee levels.
- No documented Thai examples of shared-savings splits for BESS-only contracts were found.
- The 10–15-year tenor in the Thai private market was not confirmed from a reliable source.

---

## 5. Risk inputs: customer default/closure, construction delay, curtailment, tariff decline, technology

### Takeaway
Counterparty risk is the dominant risk for a behind-the-meter PPA, and Thai SME credit is weak: about a 9% NPL ratio in mid-2026 versus about 1% for corporates, with SME lending contracting for 16 straight quarters. Model it explicitly. Use (a) a probability-weighted (expected-loss) cash-flow haircut using an annual default/closure probability × loss-given-default, **or** (b) a risk premium on the discount rate. Do not use both. Mitigate it contractually with buyout schedules, bank guarantees and mortgage/fixture protection.

### Cited Findings
- Thai commercial-bank system NPL ratio was 2.82% in Q2 2026 (2.85% in Q1) — [MGR Online](https://en.mgronline.com/economy/large-businesses-drive-commercial-bank-loans-up-2-in-q2-while-sme-credit-continu/)
- Fitch: SME NPL ratio of **about 9% (June 2026)** versus about 3% retail and **about 1% corporates**. The overall NPL ratio is expected at 3–4% over the next 1–2 years — [Nation Thailand (Fitch)](https://www.nationthailand.com/business/banking-finance/40071716)
- National Credit Bureau SME NPL ratio of **10.92%**. This is higher than the BOT-reported ~9.5% because the NCB database includes non-bank lenders — [Nation Thailand](https://www.nationthailand.com/business/economy/40069820)
- New SME defaults and overdue loans are rising — [Nation Thailand](https://www.nationthailand.com/business/banking-finance/40070729)
- SME lending contracted for a 16th consecutive quarter. Part of the headline NPL decline reflects write-offs and debt sales — [Pattaya Mail](https://www.pattayamail.com/thailandnews/thai-bank-loans-grow-2-in-q2-while-sme-lending-falls-for-4-years-562040); [Nation Thailand](https://www.nationthailand.com/business/banking-finance/40071870)
- EGAT already measures lifetime expected credit losses using a **provision matrix** (ECL under TFRS 9) for receivables. It has an existing accounting framework to provision customer credit risk on PPA receivables — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- Policy/tariff risk: the government is revisiting legacy renewable PPAs to cut power costs, with a renewal price of about THB 2.16/kWh — [Baker McKenzie](https://www.bakermckenzie.com/en/insight/publications/2026/07/thailand-government-moves-to-revisit-legacy-renewable-ppas); [Kaohoon International](https://www.kaohooninternational.com/?p=592392)
- The Thai private PPA framework was described as "still in their infancy", with best practices still developing. This is regulatory/contract-enforcement risk — [Tilleke & Gibbins](https://www.tilleke.com/insights/seven-things-look-your-private-power-purchase-agreement/)

### Inferences
- **Important caveat:** NPL ratios are stock ratios (share of loans non-performing), **not** annual probabilities of default. Use them to rank customer tiers, not as PD directly. A large, rated factory (corporate tier, ~1% NPL) and an unrated SME (~9–11% NPL) should get different PDs or premiums.
- **Risk input list:**

| Risk | Input | Unit | Typical value / approach | Why it matters (illustrative impact) |
|---|---|---|---|---|
| Customer default / factory closure | Annual PD (or closure probability) | % p.a. | Tiered, e.g. 0.5–1% (large corporate), 2–3% (mid SME), more for weak credits (inference; calibrate with bank/NCB/credit-rating data) | Survival over 15 yrs: 0.99^15 = 86%, 0.98^15 = 74%, 0.97^15 = 63%. A 2% PD removes about a quarter of late-year expected revenue |
| | Loss-given-default | % | 1 − (recovery via buyout, security deposit, redeployment of panels/BESS) | Security plus relocatable assets cut LGD |
| | Security deposit / bank guarantee | months of billing | 3–6 months (inference) | Directly reduces LGD |
| | Redeployment/removal cost | THB/kWp, THB/kWh | Estimate | BESS is containerised and more relocatable than rooftop PV |
| Construction delay | Delay to COD | months | P50 0, stress 3–6 | 6-month delay at 7% ≈ 3.3% value loss from timing alone, plus lost revenue in a degraded first year |
| Curtailment / zero-export | % of generation unused | % | Depends on load matching; behind-the-meter usually zero-export | Unused kWh is unpaid unless deemed energy or take-or-pay |
| Load-profile change | % change in daytime load | % | Scenario (shift reduction, relocation) | Hits self-consumption ratio directly |
| Tariff decline | Real PEA/MEA tariff change | % p.a. | Base 0, stress −1 to −2%/yr | Discount-to-tariff revenue falls one-for-one |
| Technology / performance | PV degradation; BESS capacity fade; inverter/BESS replacement | %/yr; year; THB | Use OEM warranties | Replacement capex mid-term; output decline |
| Policy / regulatory | Change in net-billing, ERC rules, licensing | Scenario | 2026 PPA repricing precedent | Price-reopener clause |
| Interest-rate risk (if floating debt) | BIBOR shift | bp | +100 to +200 bp stress | EGAT has some 6M-BIBOR loans |

- **Two valid ways to price credit risk (choose one):**
  1. Expected cash flow = contractual cash flow × survival probability + recovery on default, discounted at base WACC. This is more transparent and lets the buyout and security values show up.
  2. Contractual cash flows discounted at WACC + credit premium, where the premium is roughly PD × LGD. For example, 2% × 60% ≈ 1.2 pp.
- Battery-only shared-savings contracts carry **extra measurement risk**: baseline and demand-charge savings depend on the customer's operations. This argues for a higher risk premium or a fixed capacity-fee structure.

### Gaps
- No Thai-specific annual PD or factory-closure rate (as opposed to NPL stock ratios) was found. TMB/ttb, KBank, NCB or TRIS default studies could supply this.
- No Thai data was found on C&I PPA payment-default experience by developers (for example disclosures by listed rooftop developers).
- No source was found for Thai construction-delay statistics for rooftop/BESS.

---

## 6. Appraisal methods and outputs (NPV, IRRs, payback, LCOE/LCOS, DSCR, sensitivity, scenarios, break-even, Monte Carlo/P50-P90)

### Takeaway
Investment committees and lenders expect a standard metric set: **project NPV and IRR versus hurdle/WACC, payback and discounted payback, LCOE/LCOS versus offered price, sensitivity (tornado), scenarios, break-even**. DSCR and equity IRR are needed only if the project carries dedicated debt. P50/P90 energy yield, and optionally Monte Carlo, are needed for the solar yield and credit risk.

### Cited Findings
- GLOBAL PRACTICE (ADB): financial viability is tested by comparing FIRR with WACC. Economic viability (ENPV/EIRR) is computed on incremental with-vs-without-project cash flows — [ADB financial analysis appendix](https://www.adb.org/sites/default/files/linked-documents/41626-01-ind-fa.pdf); [ADB Guidelines (2017)](https://www.adb.org/documents/guidelines-economic-analysis-projects)
- GLOBAL PRACTICE (NEDA-ICC): accept if FIRR > WACC and NPV at WACC > 0 — [NEDA ICC Guidelines](https://depdev.gov.ph/wp-content/uploads/2013/10/ICC-Project-Evaluation-Procedures-and-Guidelines-as-of-24-June-2004.pdf)
- EGAT's own regulated-business benchmark is WACC, per the ERC return cap — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- EGAT bank loans include financial-ratio covenants ("certain key financial ratios for the long-term loan from financial institutions and debentures"). Any project-level debt would likely carry similar covenants — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)

### Inferences
- **Recommended output set and the inputs each needs (GLOBAL PRACTICE, researcher synthesis):**

| Output | Formula / definition | Required inputs | Who expects it |
|---|---|---|---|
| Project NPV | Σ unlevered FCF/(1+WACC_proj)^t | Capex, opex, revenue, tax, WC, terminal value, hurdle | IC (primary decision rule) |
| Project IRR | Rate where NPV = 0 | Same | IC; compare with hurdle (WACC + premium) |
| Equity IRR | IRR of equity cash flows after debt service | Plus debt amount, rate, tenor, fees | IC if leveraged; sponsors |
| Simple and discounted payback | Years to recover capex (undiscounted/discounted) | Cash flows | IC; must be < PPA tenor with margin |
| LCOE (solar) | PV(capex + opex − residual)/PV(kWh delivered) | Capex, opex, degradation, yield, rate | Pricing floor; compare with PPA price and PEA tariff |
| LCOS (BESS) | PV(capex + opex + charging cost + augmentation)/PV(kWh discharged) | Cycles/yr, round-trip efficiency, depth of discharge, fade, augmentation | Battery-only and solar+BESS pricing |
| DSCR (min, avg) | CFADS/debt service | Debt terms | Lenders; typically sized at ~1.20–1.40× for contracted solar (convention; not Thai-sourced) |
| Sensitivity (tornado) | ±X% on each input | All key inputs | IC. Typical top bars: discount rate, tariff/discount %, yield/self-consumption, capex, customer default |
| Scenario analysis | Bundled cases (base/downside/upside; tariff-cut; early-exit) | Coherent input sets | IC, risk committee |
| Break-even analysis | Max discount %, min tariff, min self-consumption, max capex for NPV = 0 | Model | Sales team (price negotiation), IC |
| P50/P90 yield | Exceedance probabilities of annual kWh | Irradiance data, loss assumptions, inter-annual variability | Lenders size debt on P90 (1-yr or 10-yr); IC base case on P50 |
| Monte Carlo | Distribution of NPV/IRR from joint input distributions | Distributions and correlations (tariff, yield, PD, capex) | Optional; useful for portfolios of many factories |

- **Product-specific note:** Solar PPA is energy-volume-driven (P50/P90 matter most). Battery-only is savings-driven: demand charge, TOU spread and cycles, so tariff-structure scenarios matter most. Solar+BESS needs both plus dispatch logic.
- **Portfolio view:** EGAT will hold many small contracts. Report portfolio NPV and concentration (by sector/customer) as well as single-project metrics. Diversification lowers variance but not expected default loss.

### Gaps
- No Thai lender (Thai bank) DSCR or P90 requirements for C&I rooftop/BESS were found in this session.
- No public EGAT or สคร. investment-committee template listing the required metrics was found.
- Lazard LCOE+/LCOS and NREL ATB methodology documents were not retrieved in this session (budget limit). They are recommended references for LCOE/LCOS formulas.

---

## 7. Time structure: construction period, COD, mid-year vs end-year convention, model horizon vs contract term

### Takeaway
Behind-the-meter projects build quickly (months, not years), but timing conventions still move NPV by a few percent. The model horizon should equal the PPA tenor, plus explicit treatment of what happens after expiry (transfer, renewal or removal). It should also align with asset life: PV 20–25+ years, BESS about 10–15 years, so a mid-life battery replacement is needed in 20–25-year solar+BESS contracts.

### Cited Findings
- Thai PPA tenors are measured **from the commercial operation date (COD)**: "fixed contract term of 25 years from the commercial operation date" — [Baker McKenzie](https://www.bakermckenzie.com/en/insight/publications/2026/07/thailand-government-moves-to-revisit-legacy-renewable-ppas)
- EGAT book lives: power plant/machinery 2–45 years; electrical control system 3–25 years. No depreciation is charged on assets under construction — [EGAT Financial Statements 2024](https://www.egat.co.th/home/en/wp-content/uploads/2025/06/EGAT-Financial-Statements-2024.pdf)
- Rooftop solar no longer requires a factory licence, which shortens pre-COD permitting — [Tilleke & Gibbins](https://www.tilleke.com/insights/thailand-removes-factory-license-requirement-for-solar-rooftop-installations)

### Inferences
- **Time-structure inputs:**

| Input | Unit | Typical value | Why it matters |
|---|---|---|---|
| Valuation date (t = 0) | date | Financial close / IC decision | Anchor for discounting |
| Development + construction period | months | ~3–9 months for 0.2–2 MWp rooftop / ≤2 MW BESS (inference) | Capex timing; delay risk |
| Capex drawdown profile | % by month/quarter | e.g. deposit + milestones | NPV of capex |
| COD | date | Start of PPA tenor | Revenue start |
| Model period granularity | monthly/annual | Monthly in year 1 and for BESS TOU logic; annual thereafter acceptable | Seasonal yield, TOU tariffs, demand charges |
| Discounting convention | end-year / mid-year | Mid-year for operating flows that accrue through the year | Mid-year raises PV by (1+r)^0.5 ≈ 3.4% at 7% versus end-year |
| Model horizon | years | = PPA tenor, plus optional residual/renewal period | Value outside the contract is speculative and should be shown separately |
| Terminal/residual value | THB | 0 (transfer to customer at THB 1), salvage, or removal cost (negative) | Can swing NPV for short tenors |
| BESS replacement/augmentation year | year | ~yr 10–12 (inference; per OEM cycle warranty) | Large mid-life capex in 20–25-yr contracts |
| Inverter replacement | year | ~yr 10–15 (inference) | Mid-life capex |
| Fiscal year alignment | — | EGAT reports calendar-year (31 Dec) | Remittance timing and corporate budgeting |

- **Horizon versus tenor rule:** if PPA tenor < asset life, do not count post-tenor revenue in the base case unless a renewal/transfer price is contracted. Show post-tenor value as an upside scenario. If tenor > BESS life, include replacement capex and its financing.
- **Combined numeric sensitivity of timing choices (illustrative):** mid-year convention (+3–4%) and a 6-month COD delay (−3% timing alone, plus lost revenue) together can move NPV by about 5–8% on a marginal project. This is enough to change an accept/reject decision near the hurdle.

### Gaps
- No Thai-sourced data was found on actual construction durations for C&I rooftop/BESS. No EGAT internal convention (mid-year vs end-year) was found publicly.
- BESS replacement-year and augmentation norms were not sourced from OEM/Thai data in this session.
