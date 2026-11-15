# Thai C&I Solar PPA and C&I BESS Market Benchmarks (for sanity-checking EGAT factory PPA feasibility inputs/outputs)

Research date: 2026-11-09. Source tags: [P] = primary/official or tariff data, [R] = research house / NGO / academic, [N] = news, [V] = vendor/marketing claim (treat as an upper-bound sales pitch, not a market average), [I] = my inference or arithmetic from the cited figures (not a sourced fact).

Caveat up front: Thai developers (GPSC, Gulf, BGRIM, BCPG, Banpu NEXT, Gunkul, SCG Cleanergy, etc.) generally do **not** publish project-level IRR, PPA price, or discount for private rooftop PPAs. Most price, discount and tenor figures in the public domain come from vendor websites. The ranges below agree with each other, but none of them is an audited market average.

## 1. Thai C&I private PPA pricing: discount, THB/kWh, tenor, escalation, providers, target IRR

### Takeaway
The market-standard Thai rooftop private PPA offers a **10-30% discount to the PEA/MEA tariff, with 15% most often quoted**, on a **15-year tenor (range 10-25 years)**. Most contracts are a flat percentage discount that floats with the utility tariff (including Ft), and the system transfers to the factory at the end of the term. I found no listed developer that discloses its target equity or project IRR for rooftop PPAs. An EGAT model assumption outside a 10-25% discount or a 10-20 year tenor would need an explicit justification.

### Cited Findings

**Benchmark table: PPA commercial terms**

| Model input | Benchmark range | Most-cited value | Source / date / quality |
|---|---|---|---|
| Discount to PEA/MEA tariff | 10-30% | 15% | Typical PPA described as "10-30% below PEA/MEA grid tariffs" — [RedSolar TH, 2026](https://redsolarth.com/direct-ppa-in-thailand-2026-complete-guide-to-buying-corporate-green-power-direct-ppa-ugt-rooftop-solar/) [V] (it attributes the figure to Krungsri Research, but the Krungsri article I read does not state it) |
| | ">15%" / "flat 15%" / "15-30%" / "up to 30%" | 15% | Thai vendor pages from a search of Energy Green Plus, PowerVault, SolarPPM, Loxcons and ThaiSolarPPA — [Energy Green Plus](https://energygreenplus.co.th/2023/03/28/aticle-private-ppa-th/), [PowerVault](https://powervaultthailand.com/what-is-private-ppa-zero-cost-solar-investment/), [SolarPPM](https://solarppm.com/solar-ppa-for-factory/), [ThaiSolarPPA](https://www.thaisolarppa.com/article/solar-cell-factory-reduce-electricity-bill) [V] |
| | up to 30% (15-yr contract) | — | SIS × "Chang Solar Cell" Private PPA launch, July 2025 (2568): "free installation over a 15-year contract, cuts bills up to 30%" — [Innolife Thailand](https://www.innolifethailand.com/?p=33910) [N/V] |
| Absolute PPA price | THB 2.50-3.20/kWh | — | One provider's price band — [CapSolar](https://capsolar.co.th/en/knowledge/what-is-ppa) [V] |
| Reference tariff the discount applies to | Factory all-in about THB 3.92-4.25/kWh (Sep-Dec 2026) | — | [CapSolar Factory Electricity Cost Index](https://capsolar.co.th/en/knowledge/thailand-factory-electricity-cost-index) [V, tariff-derived] |
| | Average retail THB 3.61 (2021), 4.57 (2023), 4.18 (2024); government cap of THB 4/unit through 2025 | — | [Krungsri Research, 3 Sep 2025](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2-2025) [R] |
| | Average retail tariff about THB 3.88/kWh (Jan-Apr 2026); May-Aug 2026 tariff capped at THB 3.95/kWh; ERC considered THB 4.08-4.59 | — | [IEEFA, Aug 2026](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R] |
| Contract tenor | 10-25 years | 15 years | "usually 10-15 years"; "Thai standard Private PPA is 15-20 years (some up to 25)"; "factory Solar PPA about 15-25 years" — Thai vendor pages from the same search as above [V]; SIS 15-year contract — [Innolife](https://www.innolifethailand.com/?p=33910) [N] |
| End-of-term | System transfers to factory | — | "factory takes ownership after the contract ends" — [Thai Solar Energy (TSE)](https://www.thaisolarenergy.com/index.php/solar-pv-rooftop-private-ppa/) [V]; one vendor offers transfer from **year 8** onward (buy-out option) — vendor search result [V] |
| Escalation / indexation | Floating discount that tracks the PEA/MEA tariff, incl. Ft | — | Vendors describe the PPA as "a flat-rate discount" (ส่วนลดคงที่) against the utility bill — [Energy Green Plus](https://energygreenplus.co.th/2023/03/28/aticle-private-ppa-th/) [V]. Gunkul markets a "fixed, certain electricity rate" — [Gunkul Private PPA](https://www.gunkul.com/th/businesses/energy-business/private-ppa) [V]. **Both structures (floating % discount, and fixed price) are on offer.** |
| Contract risks flagged to buyers | Early-termination penalty, change of ownership, plant relocation | — | Vendor search results (Loxcons 2026 pros/cons) — [Loxcons](https://loxcons.org/solar-rooftop-factory-pros-cons/) [V] |

**Who offers C&I rooftop PPAs (with disclosed scale)**

| Company | Data point | Source / date |
|---|---|---|
| Gunkul (GUNKUL) | 84.025 MW across 754 Private PPA projects | [Gunkul website](https://www.gunkul.com/th/businesses/energy-business/private-ppa) [P, company site, undated] |
| BCPG | Acquired Scan Advance Power (17.5 MW rooftop private PPA portfolio), closed 23 Mar 2026; renaming it "BCPG Energy Solutions". Deal value not disclosed | [BCPG newsroom, 24 Mar 2026](https://www.bcpggroup.com/th/newsroom/news/663/) [P] |
| BCPG | Longer-term target of 100 MW of Thai rooftop private PPA (secondary mention) | [Mordor Intelligence company page](https://www.mordorintelligence.com/industry-reports/thailand-solar-energy-market/companies) [R, secondary] |
| Prime Road Power (PRIME) | 4 Thai private PPA rooftop projects, 5.346 MW contracted (via subsidiary Prime Road Rooftop) | [PRIME One Report 2567 / SEC filing](https://primeroadpower.com/wp-content/uploads/2025/03/TH_PRIME_One-Report_2567_website.pdf) [P] |
| Banpu NEXT | Target of more than 300 MW of clean power in Thailand by 2030; more than 200 C&I net-zero projects; rooftop solar + BESS at Green Rubber Energy (tyre recycling, Samut Prakan); Direct PPA talks with data centres | [Infoquest, 3 Nov 2026](https://www.infoquest.co.th/2026/673065) [N] |
| BGRIM | 500-600 MW ready to bid under the Direct PPA policy; expanding rooftop | [HoonVision interview](https://www.hoonvision.com/hoonset/exclusive-bgrim-2/) [N] |
| SCG Cleanergy | JV with B.Grimm Power Service (SCGC 51%), Jan 2022 | [YOG Infra Q1 2022](https://www.yoginfra.com/post/infrastructure-ppps-in-thailand-q1-2022-update) [N, old] |
| PSTC | Headline: "THB 1bn budget for solar rooftop, targeting 200 MW PPA" (date not confirmed) | [PSTC news](https://www.pst.co.th/news-detail.php?id=774) [P, company] |
| SIS (with Chang Solar Cell) | 15-year private PPA, up to 30% saving, July 2025 | [Innolife](https://www.innolifethailand.com/?p=33910) [N] |
| TSE (Thai Solar Energy) | Zero-capex rooftop PPA, discounted tariff, ownership transfer at end | [TSE](https://www.thaisolarenergy.com/index.php/solar-pv-rooftop-private-ppa/) [P] |
| Krungsri (bank channel) | Bank-arranged "Private PPA: Solar Rooftop" product for SMEs | [Krungsri Business Link](https://www.krungsribusinesslink.com/th/service/private-ppa-solar-rooftop) [P] |

**Target IRRs**
- No disclosed private-PPA project IRR was found for GPSC, Banpu NEXT, SCG Cleanergy, BGRIM, Gunkul, BCPG or PRIME in the sources searched. Analyst coverage gives equity target prices only (for example, Krungsri Securities: GPSC TP THB 61, GULF TP THB 77) — [Kaohoon International](https://www.kaohooninternational.com/markets/593697) [N].

### Inferences
- [I] Gunkul's average deal is 84.025 MW / 754 ≈ **0.11 MWp per project**, while PRIME's averages about 1.3 MWp. EGAT's 0.2-2 MWp target therefore sits in the mid-size band: bigger than the SME deals that dominate project counts, smaller than the multi-MW industrial-estate deals.
- [I] With a floating % discount (the dominant structure), the PPA price moves with the Ft. A model should index the PPA price to the tariff rather than apply a fixed THB/kWh escalator, or else run a tariff-decline scenario. Tariffs fell from 4.57 (2023) to about 3.88-3.95 (2026), roughly 15% in 3 years, which is a real downside risk to PPA revenue.
- [I] Sanity rule for the model: discount 10-15% gives the developer a comfortable margin; 20-25% is competitive; above 30% looks like marketing and should only appear with very low capex or long tenor. Tenor below 10 years or above 20 years is off-market for rooftop.
- [I] At a THB 3.9-4.2/kWh reference tariff and a 15% discount, the effective PPA price is about **THB 3.3-3.6/kWh**. That is above CapSolar's quoted THB 2.50-3.20 band, which implies that vendor offers a deeper discount (roughly 20-35%) or prices against off-peak-heavy tariffs. Treat THB 2.5-3.6/kWh as the plausible PPA price envelope.

### Gaps
- No audited or analyst-confirmed project IRR for Thai rooftop private PPAs. Developer 56-1 One Reports (GPSC, BCPG, Gunkul, PRIME) and investor-day decks would be the place to look, but I could not retrieve IRR statements from them in this session.
- No Thai deal-level disclosure of a fixed-price PPA escalation clause (for example, a % per year step) was found.
- International players (ENGIE, TotalEnergies ENEOS, Sharp, CHINT) Thai C&I PPA terms were not found. The only item was TotalEnergies ENEOS's 1.8 MW floating solar with S. Kitjai in Khon Kaen, cited by [Krungsri Research](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2-2025).
- The BCPG 17.5 MW acquisition price (which would give an implied THB/MW valuation) was not disclosed.

## 2. C&I rooftop deal sizes, capex, customer industries, self-owned payback, and PPA-provider returns

### Takeaway
C&I rooftop capex in Thailand fell to about **THB 20-25/Wp (THB 20-25M per MWp) in 2023-2024**, from THB 27.5/Wp in 2020. Krungsri Research quotes a **3-5 year payback for businesses** that self-own and self-consume, and 5-8 years for households. C&I dominates Thai rooftop: 2.2 GW of 3.6 GW as of January 2026. An EGAT model showing a factory-owned payback much above 6 years, or capex outside about THB 18-28M/MWp, needs a reason (for example a small roof, structural reinforcement, or low self-consumption).

### Cited Findings

**Benchmark table: capex, yield and returns**

| Model input / output | Benchmark | Source / date / quality |
|---|---|---|
| C&I installed capex | THB 20-25/Wp (2023-2024); THB 27.5/Wp (2020) | [Krungsri Research, 3 Sep 2025](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2-2025) [R] |
| Small-commercial capex | 100 kW ≈ THB 3.35M (THB 33.5/Wp); 30 kW ≈ THB 1.17M; 10 kW ≈ THB 430k (2024-2025 averages) | Same Krungsri report, footnote 6 [R] |
| Module cost | THB 10.5/Wp (2023), from THB 16/Wp (2019-2020) (residential) | Same Krungsri report [R] |
| Self-owned payback (business) | 3-5 years | Same Krungsri report [R] |
| Self-owned payback (household) | 5-8 years (example: 10 kW, THB 500k, saves THB 75-100k/yr, a 15-20% simple yield) | Same Krungsri report [R] |
| Residential payback (IEEFA model) | 5 kW ≈ 7+ yrs; 10 kW ≈ 5.9 yrs; TOU with 80% self-use ≈ 5.1-6.1 yrs. IEEFA did **not** model C&I | [IEEFA, Aug 2026](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R] |
| System life / degradation | 25-30-year life; performance warranty typically 80-90% of original output | [Krungsri Research](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2-2025) [R] |
| O&M contract term | 20-25 years | Same [R] |
| Export value of surplus | THB 2.20/kWh residential buyback (net billing, 10-yr tenor, 500 MW cap per round under NEPC 1/2569). No general C&I export scheme: C&I value comes from self-consumption | [IEEFA, Aug 2026](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R]; [Reslink 2026](https://www.reslink.org/blogs/thailand-rooftop-solar-2026/) [V] |
| Tax incentives | BOI Activity 7.1.2, Category A2: CIT exemption up to 8 years — [Reslink](https://www.reslink.org/blogs/thailand-rooftop-solar-2026/) [V]. 150% corporate deduction for certified energy-saving equipment incl. solar, **not combinable** with BOI/EEC — [IEEFA](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R] |
| Concessional finance | Clean-energy loans 1-2% below market, 15-20 yr repayment; ICBC Leasing × Huawei from 2.99% p.a. | [Krungsri Research](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2-2025) [R] |
| Permitting | Factory Act and building-code amendments exempt rooftop solar (even above 1 MW) from factory licence and complex building-modification permits | [IEEFA, Aug 2026](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R] |

**Market size and customers**
- C&I accounted for **2.2 GW of 3.6 GW** cumulative rooftop solar as of January 2026 — [IEEFA, Aug 2026](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R], citing ERC.
- Electricity is typically **10-30% of factory manufacturing cost** and 15-20% of operating overhead for malls — [Krungsri Research](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2-2025) [R].
- The draft PDP 2026 reportedly targets up to 10 GW of rooftop solar procurement — [pv magazine, 10 Sep 2026](https://www.pv-magazine.com/2026/09/10/thailand-paves-the-way-for-10-gw-of-rooftop-solar/) [N].
- Named C&I customer types in deals: tyre recycling (Green Rubber Energy), industrial estates (Apex Green, Chachoengsao), exhibition/retail (BITEC Buri, Summer Lasalle), data centres — [Infoquest, Nov 2026](https://www.infoquest.co.th/2026/673065) [N].

### Inferences
- [I] **Capex check:** a 1 MWp system at THB 20-25/Wp costs THB 20-25M. Below 0.2 MWp, per-Wp cost rises steeply (100 kW ≈ THB 33.5/Wp), so the smallest EGAT sites (0.2 MWp) should carry a capex premium of roughly 10-30% over 1-2 MWp sites.
- [I] **PPA-provider return check:** if a 3-5 year self-owned payback is the market reality at the full tariff, then a provider who gives up 15% of the tariff and adds O&M, insurance and overhead should see a payback of roughly 5-7 years and a project IRR of roughly low-to-mid teens over 15 years. This is my arithmetic, not a disclosed figure. If EGAT's model shows a PPA project IRR above about 20% at a 15% discount, check the yield, self-consumption and capex assumptions. Below about 8%, check for over-specified capex or a too-deep discount.
- [I] The 3-5 year payback quoted by Krungsri assumes near-100% self-consumption at the full retail tariff. Factories that run fewer shifts, with weekend shutdowns, export more, and exports are worth little (or nothing) to a C&I site. Self-consumption ratio is the single most important yield-to-revenue conversion input.

### Gaps
- No sourced Thai specific yield (kWh/kWp/yr) was captured in this session. Commonly used values are about 1,300-1,450 kWh/kWp/yr, but that range is unverified here and should be sourced from PVGIS/Global Solar Atlas or DEDE.
- No disclosed PPA-provider project IRR from any Thai developer (see Q1 gaps).
- No survey-based distribution of C&I deal sizes. Only the averages inferred from Gunkul and PRIME.

## 3. C&I BESS in Thailand: deployments, business cases, paybacks, why adoption is slow, and international comparison

### Takeaway
Behind-the-meter BESS in Thai factories is **not yet commercially self-justifying on tariff savings alone at 2024-2025 prices**. A 2025 Thai academic study found NPV < 0 and IRR < 8% until battery prices fall to about THB 2,880/kWh (around 2030). The reasons are structural. The TOU energy spread is only about **THB 1.5-1.6/kWh**, the demand charge at 22-33 kV is about **THB 133/kW-month**, and that demand charge is set by the single highest 15-minute peak across a **13-hour on-peak window (09:00-22:00 weekdays)**, which short-duration batteries struggle to shave. Markets where C&I BESS pays (Philippines; US/Europe demand-charge markets) have higher demand charges, larger spreads, or diesel/brownout avoidance value.

### Cited Findings

**Benchmark table: Thai tariff drivers of BESS value (PEA TOU base rates in effect since the May 2023 bill, excl. Ft and VAT)**

| Voltage (Type 3.2 / 4.2 TOU) | Demand charge on-peak (THB/kW-month) | On-peak energy (THB/kWh) | Off-peak energy (THB/kWh) | Spread (THB/kWh) [I] |
|---|---|---|---|---|
| ≥69 kV | 74.14 | 4.1025 | 2.5849 | 1.52 |
| 22-33 kV | 132.93 | 4.1839 | 2.6037 | 1.58 |
| <22 kV | 210.00 | 4.3297 | 2.6369 | 1.69 |

Sources: [LEONICS tariff explainer, 28 Sep 2026](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html) [V, reproduces PEA rates]. The ≥69 kV row is confirmed by search summaries of [RedSolar](https://redsolarth.com/thailand-electricity-prices-tou-tariffs-2026-complete-guide-for-commercial-industrial-solar-roi-calculations/). Further details from LEONICS: off-peak demand charge = 0; on-peak = Mon-Fri 09:00-22:00; demand = highest 15-minute average in the on-peak period; service charge THB 312.24/month; Ft revised every 4 months.
- Conflict: Chinese BESS vendors' Thai case studies cite a "peak-valley difference exceeding 2.5 THB/kWh" — [LVFU Energy](https://www.lvfuenergy.com/case-list/thailand-ci-solar-storage-integration-project/), [Zhongmeng](https://zhongmengelectric.com/thailand-solar-storage-case-study/) [V]. The official TOU rates imply only about 1.5-1.7. **Treat the 2.5 figure as an overstatement.** One guide's claimed T3-2 demand charge of THB 250-300/kW-month also conflicts with the tariff tables and should not be used.

**Benchmark table: BESS economics and costs**

| Input / output | Benchmark | Source / date / quality |
|---|---|---|
| Thai PV+BESS peak-shaving IRR | 77 kW / 154 kWh BESS shaving 10% of a 770 kW peak: IRR < 8%, NPV < 0 for 2024-2029; breakeven (IRR 8.65%) only when battery cost reaches about **THB 2,880/kWh** (2030). Authors recommend "watchful waiting" | [TEEJ Vol 5 No 3, published 25 Nov 2025, RMUTL](https://ph04.tci-thaijo.org/index.php/TEE_J/article/view/11308) [R] |
| Global turnkey BESS price 2025 | Global average US$117/kWh; China about US$73/kWh; Europe about US$177/kWh; US about US$219/kWh (BNEF ESS Cost Survey 2025) | [Energy-Storage.News on BNEF/Ember](https://www.energy-storage.news/battery-storage-system-prices-continue-to-fall-sharply-bnef-and-ember-reports-find/) [N citing R] |
| China C&I turnkey 2025 | about US$77/kWh (secondhand repost of BNEF) | search summary of a LinkedIn repost [unverified] |
| Thai market status | "Thailand's energy storage market lags despite renewable push and upstream manufacturing support" (headline; body blocked, 403) | [Energy-Storage.News](https://www.energy-storage.news/thailands-energy-storage-market-lags-despite-renewable-push-and-upstream-manufacturing-support/) [N] |
| Thai deployments (behind-the-meter) | Banpu NEXT rooftop solar + BESS at Green Rubber Energy, Samut Prakan (solar firming / smoothing) | [Infoquest, 3 Nov 2026](https://www.infoquest.co.th/2026/673065) [N] |
| | 1.4 MWh C&I grid-tied solar+storage microgrid demo (Chinese vendor case) | [Zhongmeng](https://zhongmengelectric.com/thailand-solar-storage-case-study/) [V] |
| | EGAT + DEDE + NSTDA + Charoenchai Transformer + Innopower MOU (Sep 2026): hybrid BESS for Bangkok CBD buildings using rooftop solar, smart transformers and second-life EV batteries | [CapSolar news, 18 Sep 2026](https://capsolar.co.th/en/news/egat-partners-with-dede-and-alliances-to-enhance-rooftop-solar-and-battery-efficiency-for-integrated-2026-09-18); [Thailand Edition](https://thailandedition.com/i/egat-partners-develop-rooftop-solar-bess-00a16aace5a8cf5828c0f8f9) [N] |
| Vendor view of business case | Peak shaving has the shortest payback for most factories; no number given | [LEONICS](https://www.leonics.com/2026-09-05-bess-ess-lithium-battery-energy-storage-explained.html) [V] |
| Demand-charge saving arithmetic | At 22-33 kV, 100 kW of sustained demand reduction saves THB 13,293/month, but only if held in **every** on-peak 15-minute window that month | [LEONICS](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html) [V, arithmetic from tariff] |
| Policy | FiT 2022 scheme includes a solar+BESS category; IEEFA recommends expanding solar+BESS FiT or a standalone storage programme for evening peak | [IEEFA, Aug 2026](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R] |
| Evening-peak shift | National peak 33,177 MW at 14:30 on 28 Apr 2022; new peak 36,759 MW in 2026, with rooftop solar shifting peak toward evening | Same IEEFA [R] |

**International comparison (what makes C&I BESS pay)**

| Market | Reported C&I BESS economics | Driver | Source / quality |
|---|---|---|---|
| Philippines | Vendor case: savings US$25-35/kW-month, 3.2-yr payback, 26% IRR. Buyer guide: realistic 4-7 yr payback; demand charges 30-40% of an MV commercial bill | High tariffs, high demand charges, brownouts | [NINE Energy Storage, 2025](https://ninees.com/blog/battery-storage-in-the-philippines-a-practical-guide-for-ci-buyers-in-2025/) [V]; other vendor case via search [V] |
| Vietnam | Regulatory: BESS decree an "important first step"; TOU structure for BESS still in development | Regulation not yet settled | [Norton Rose Fulbright](https://www.nortonrosefulbright.com/en/knowledge/publications/7eb0008e/development-of-battery-energy-storage-systems-in-vietnam) [R] |
| SEA general | C&I storage in SEA rests mainly on diesel displacement and resilience rather than tariff arbitrage | Backup value | [Tedepe MEA & SEA archetypes, 2025](https://tedepe.com/ci-energy-storage-market-archetypes-a-2025-deep-dive-into-mea-sea/) [R/blog] |
| Global C&I | "Demand charges alone no longer close the project"; multi-stream projects pay back in about 3-6 years | Revenue stacking | [HowToStoreElectricity, 2025](https://howtostoreelectricity.com/c-i-energy-storage-revenue-stack-economics/) [blog] |
| ASEAN regulation | Regulatory frameworks "must evolve" to capture the full value of storage | Market access | [Energy-Storage.News](https://www.energy-storage.news/asean-regulatory-frameworks-must-evolve-to-capture-full-value-of-battery-storage/) [N]; [Clifford Chance, Sep 2025](https://www.cliffordchance.com/content/dam/cliffordchance/briefings/2025/09/energy-transition-in-southeast-asia-solving-the-storage-problem.pdf) [R] |

### Inferences
- [I] **Order-of-magnitude check for a 1 MW / 2 MWh factory BESS at 22-33 kV** (my arithmetic, not sourced):
  - Demand charge: if it reliably cuts 1 MW from the monthly on-peak max, saving ≈ 132.93 × 1,000 × 12 ≈ **THB 1.6M/yr**.
  - TOU arbitrage: one cycle per weekday, about 245 days, 2 MWh discharged, about 90% round-trip efficiency: ≈ (2,000 × 4.1839 − 2,222 × 2.6037) × 245 ≈ **THB 0.6M/yr**.
  - Upper-bound gross saving is about **THB 2.2M/yr** before degradation and O&M. Even at a low installed price, a payback under about 6-7 years requires full demand-charge capture.
- [I] **Why demand-charge capture is hard in Thailand:** the billed demand is the highest 15-minute value anywhere in 09:00-22:00 on weekdays. A 2-hour battery can only remove a narrow peak. A factory with a flat 2-shift load cannot be shaved by 1 MW for 13 hours with 2 MWh. Realistic shave depth is about the energy (kWh) above the target line, divided across the duration of the peak. The model must use 15-minute interval data; a monthly-bill model will overstate savings.
- [I] **Solar firming nuance:** solar reduces daytime energy, but a cloudy 15-minute window still sets the month's demand charge. So solar alone rarely reduces the demand charge (LEONICS makes the same point). This gives BESS a genuine role in Solar + Battery, but the value is the demand charge, not energy.
- [I] **Arbitrage is thin:** a spread of about THB 1.5-1.6/kWh less about 10% losses and degradation leaves about THB 1.1-1.3 per kWh discharged. Battery-only products relying mainly on arbitrage will show long paybacks (likely more than 10 years at Thai installed costs) unless they add demand-charge, backup/power-quality, or future grid-service value.
- [I] **Sanity rule:** Thai Battery-only IRR above about 12% or payback under about 5 years should be treated as suspicious unless the site has a sharp, short peak at <22 kV (THB 210/kW-month) or a priced backup value. That matches the academic finding of IRR < 8% at 2024-2029 costs.
- [I] The Philippines pays because of demand charges of US$25-35/kW-month (≈ THB 800-1,200/kW-month at about THB 33-35/USD, an approximate and unsourced FX) versus Thailand's THB 74-210/kW-month. That is a 4-15× difference in the main value driver.

### Gaps
- No Thai installed C&I BESS price (THB/kWh, turnkey incl. PCS, EMS, fire suppression, EPC) from a neutral source for 2025-2026. The academic study only gives its 2030 breakeven of THB 2,880/kWh. BNEF regional C&I data is paywalled.
- No reported payback or IRR from a real Thai commercial BTM BESS deployment (Banpu NEXT/Green Rubber gave no economics).
- Thai BESS safety and permitting requirements (ERC licence threshold, fire code) were not researched.
- No reliable Australian or US C&I BESS payback benchmark was retrieved in this session.
- The energy-storage.news article on why Thai storage lags returned 403, so its specific reasons are not captured.

## 4. Customer decision criteria and objections (contract length, roof risk, discount, ESG/RE100, CBAM)

### Takeaway
Thai sources cite **upfront capex (PPA removes it), electricity price level and volatility, daytime load match, and ESG positioning** as adoption drivers. The main objections are **long contract lock-in (15-25 years), early-termination penalties, change of ownership or relocation, and policy uncertainty**. I found no neutral Thai survey that quantifies these (for example, "% of factories that require a discount above X%").

### Cited Findings
- Adoption drivers listed by Krungsri Research: electricity cost level and volatility; falling equipment cost; daytime peak demand matching solar; government support (FiT/buyback); ESG/sustainability positioning. Barriers: upfront capital cost (especially SMEs), access to skilled installers, and policy/regulatory uncertainty — [Krungsri Research, 3 Sep 2025](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2-2025) [R].
- Contract-risk objections (vendor guidance to buyers): check early-termination penalties and the treatment of business sale or plant relocation; a 15-25-year PPA means long-term commitment of the roof and business structure, suited to plants without relocation plans — [Loxcons 2026](https://loxcons.org/solar-rooftop-factory-pros-cons/) [V].
- PPA is chosen by factories that want immediate bill cuts without a large upfront investment. EPC (self-own) and on-grid + BESS suit plants with high demand charges or 2-3 shift operation — [Loxcons EPC vs PPA](https://loxcons.org/solarcell-factory-solutions/) [V].
- ESG and supply-chain drivers: carbon measures, ESG requirements, Thailand's 2050 net zero, green data centres, supply-chain sustainability expectations, and IEAT support — [Infoquest, Nov 2026](https://www.infoquest.co.th/2026/673065) [N]. The article does not mention RE100 or CBAM specifically.
- Corporate demand for renewable energy for decarbonisation is cited as one reason C&I dominates Thai rooftop — [IEEFA, Aug 2026](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R].
- Competing green-power routes that a factory can choose instead of a rooftop PPA: Direct PPA pilot (about 2,000 MW, initially for BOI data centres / export manufacturers), UGT green tariffs, and RECs — [RedSolar 2026](https://redsolarth.com/direct-ppa-in-thailand-2026-complete-guide-to-buying-corporate-green-power-direct-ppa-ugt-rooftop-solar/) [V]; [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/thailand-solar-energy-market) [R]; [IEEFA](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R].

### Inferences
- [I] The persona and demo inputs should pair each discount level with a tenor. The objection evidence suggests that shorter tenors (10-12 years) or buy-out options (vendors offer transfer from year 8) are the main competitive levers alongside the discount itself.
- [I] EGAT's state-enterprise credit is a potential differentiator against the "counterparty / roof risk / who maintains it for 15 years" objection, but no source quantifies how much discount a factory would trade for that.
- [I] For exporters exposed to CBAM or RE100 supply-chain requirements, the deciding factor may be RECs/attribute ownership (who holds the I-REC from the rooftop output). The contract should specify this. I found no Thai source quantifying willingness to pay for it.

### Gaps
- No quantitative Thai factory survey (FTI, KResearch, SCB EIC) on minimum acceptable discount, acceptable tenor, or share of factories citing RE100/CBAM was found in this session.
- No Thai source quantified the cost of roof replacement or relocation risk in PPA pricing.

## 5. EGAT's own energy-solution activities relevant to C&I

### Takeaway
EGAT already markets "Smart Energy Solutions" to business customers, covering rooftop solar, an EV charging network, an energy-management platform, and REC services. It has an affiliate that does factory-rooftop EPC (EGAT Diamond Service), a 2024 MOU with Krungsri on financing smart-energy solutions, and a September 2026 R&D MOU on building-level hybrid BESS. I found **no public EGAT statement of target returns, revenue targets, or a C&I PPA product** with pricing.

### Cited Findings
- EGAT Smart Energy Solutions covers rooftop solar, EV charging, an energy-management platform and renewable energy certificates for business customers; its 2025 engineering consultancy included ground-mounted solar with BESS for private power projects — [EGAT profile](https://www.egat.co.th/home/en/about-egat/) [P] (search summary; the customers page [energysolutions.egat.co.th/customers](https://energysolutions.egat.co.th/index.php/customers) returned 404 on fetch).
- EGAT Diamond Service (EDS) is listed as an EGAT affiliate that designs, supplies and oversees rooftop solar installation on factory roofs — [EGAT profile](https://www.egat.co.th/home/en/about-egat/) [P, search summary].
- EGAT × Krungsri signed an MOU (April 2024) to promote Smart Energy Solutions through knowledge and financing for businesses — [Krungsri news](https://www.krungsri.com/th/newsandactivities/krungsri-banking-news/egat-krungsri-promote-smart-energy-solutions) [P].
- EGAT, DEDE, NSTDA, Charoenchai Transformer and Innopower MOU (September 2026): hybrid BESS for Bangkok CBD building groups combining rooftop solar, smart transformers and second-life EV batteries — [CapSolar news, 18 Sep 2026](https://capsolar.co.th/en/news/egat-partners-with-dede-and-alliances-to-enhance-rooftop-solar-and-battery-efficiency-for-integrated-2026-09-18); [Thailand Edition](https://thailandedition.com/i/egat-partners-develop-rooftop-solar-bess-00a16aace5a8cf5828c0f8f9) [N].
- EGATi (international arm) has a solar plant and BESS in Taiwan, with further RE/BESS projects there in development — [EGAT profile](https://www.egat.co.th/home/en/about-egat/) [P, search summary].
- EGAT's Sirindhorn Dam floating hydro-solar hybrid: 45 MW, about 47,000 tCO2/yr, production began 31 October 2021 — [Krungsri Research](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2-2025) [R].
- EGAT's balance-sheet context: still carries more than THB 31-36 billion in losses from past fuel-cost absorption; the cabinet allowed it to borrow THB 85 billion for liquidity in 2022 — [IEEFA, Aug 2026](https://ieefa.org/sites/default/files/2026-08/IEEFA%20Report_Reforming%20Thailand's%20rooftop%20solar%20policy%20framework%20to%20reduce%20gas%20dependence_August%202026.pdf) [R]. This is relevant to its hurdle rate and appetite for capex-heavy BTM assets.
- EGAT 5-star certified equipment qualifies for the 150% depreciation/deduction scheme — [SurgePV](https://www.surgepv.com/blog/solar-incentives-in-thailand) [V].

### Inferences
- [I] Because EGAT is also the bulk generator whose daytime sales a factory rooftop displaces, an EGAT-owned BTM PPA partly cannibalises EGAT's (and PEA/MEA's) own sales. The feasibility case is stronger framed as customer retention, green-attribute supply and evening-peak relief (BESS) than as stand-alone IRR. This is consistent with IEEFA's emphasis on solar+BESS for evening peak.
- [I] EGAT's financial strain (legacy Ft losses) argues for a hurdle rate no lower than its cost of debt plus a risk premium for counterparty and roof risk. The model's discount rate should be stated explicitly and stress-tested.

### Gaps
- No found brand or details for "ENZY" or "EGAT ENCO" in this session; the name and scope need confirmation from EGAT directly.
- No EGAT revenue target, MW target, or return statement for C&I energy solutions.
- The EGAT Smart Energy Solutions customer list was not retrievable (404).
