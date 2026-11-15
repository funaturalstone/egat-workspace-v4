# Cost-side inputs (CAPEX, OPEX, lifecycle, end-of-life) for behind-the-meter C&I rooftop solar + BESS at Thai factories, with benchmarks

Scope: EGAT-owned behind-the-meter systems at mid-size Thai factories (0.2–2 MWp rooftop PV, 0.25–2 MW BESS), sold to the factory under a C&I PPA or shared-savings contract. Three products: Solar PPA, Solar + Battery, Battery only.

**FX convention used in these notes:** 1 USD ≈ 33.7 THB. This is a converter snapshot dated 2026-11-03 that appeared in search results. The 2026 range was 30.88 (28 Jan 2026) to 33.87 (23 Jul 2026), per [Pound Sterling Live USD-THB 2026 history](https://www.poundsterlinglive.com/history/USD-THB-2026). Treat FX as a model input and run a sensitivity on it, because modules, inverters and LFP cells are priced in USD.

**How reliable the sources are:** Thai C&I-specific price data comes mostly from installer and vendor marketing pages (capsolar, Saimai, SolarEdge TH, Green Energy Thailand) and one bank research note (Krungsri Research). I found no ERC, DEDE or EPPO dataset of C&I unit costs. I also found no listed developer (SCG Cleanergy, GPSC, Gulf, BCPG, etc.) that discloses a THB/kWp figure for its C&I rooftop portfolio. Vendor numbers are labelled as such below.

---

## 1. Solar CAPEX: line items and current Thai THB/kWp turnkey prices by size

### Takeaway
Thai C&I rooftop turnkey EPC prices in 2024–2026 cluster around **18–26 THB/Wp (18–26 million THB/MWp)**. Krungsri Research gives **20–25 THB/Wp** for business and factory buildings in 2023–24. Unit cost falls steeply up to about 100 kWp (≈33.5 THB/Wp) and flattens above about 400 kWp (≈18–25 THB/Wp). Thai prices sit well above global utility-scale benchmarks (IRENA 2024: USD 691/kW ≈ 23.3 THB/W, utility-scale). Most site-specific items (roof reinforcement, waterproofing, metering, zero-export relay, PEA study) have no published Thai benchmarks and must come from quotes.

### Cited Findings
**Turnkey price vs. size (economies of scale)**
- Krungsri Research (21 Aug 2025 note, 2023–2025 data) gives these total installed costs. Unit costs are derived:
  - 3 kW = 170,000 THB (~56,700 THB/kW)
  - 5 kW = 230,000 (46,000/kW)
  - 10 kW = 430,000 (43,000/kW; the main text says 500,000, which is inconsistent)
  - 30 kW = 1.17 M (39,000/kW)
  - **100 kW = 3.35 M THB (33,500 THB/kW)**
  - **Business/factory buildings: 20–25 THB/Wp (2023–24), i.e. ~20–25 M THB/MW**
  - Residential: 39 THB/Wp (2023); residential module price 10.5 THB/Wp (2023)
  - Payback for systems >100 kW: 3–5 years (owner self-consumption, not PPA)
  - Source: [Krungsri Research – Solar Rooftop business models (TH), 2025](https://www.krungsri.com/th/research/research-intelligence/solar-rooftop-2-2025)
- Saimai Solar (installer, 2026 price page) quotes a 400 kW factory EPC at 7.2 M THB, about **18 THB/Wp** — [Saimai Solar](https://saimaisolar.com/services/)
- Capsolar (installer with a commercial interest, 2026) puts a 2 MW cash-purchase system at 48–52 M THB, about **24–26 THB/Wp** — [capsolar financing page](https://capsolar.co.th/th/knowledge/solar-financing-thailand-factory)
- SolarEdge Thailand (vendor, 2026) gives **15,000–25,000 THB/kWp** for business systems and says cost per watt falls with size — [SolarEdge TH industrial cost](https://www.solaredge.com/th/solar-cell-cost-for-industrial)
- Sunnergytech (vendor): systems of 100 kW and up start from 3 M THB (≈30 THB/W at 100 kW) — [Sunnergytech 2568–2569](https://www.sunnergytech.com/article/942/solar-installation-cost-2568-2569)
- Green Energy Thailand (17 Mar 2026; cites Namsang and ExpatDen 2025): 20 kW = 450–600k THB, 50 kW = 1.0–1.3 M THB (**20–26k THB/kW**) — [Green Energy Thailand](https://www.greenenergythailand.com/posts/solar-panel-installation-costs/)
- IEEFA (via GreentechLead) estimates Thai rooftop installation cost at about **USD 936/kW (≈31,500 THB/kW)**, roughly 50% above Pakistan, Malaysia and Vietnam. The segment is not specified, so this probably blends residential and commercial — [GreentechLead](https://greentechlead.com/solar/thailand-rooftop-solar-market-needs-policy-reform-as-3-6-gw-capacity-lags-60-renewable-energy-target-54829)
- Reccessary reports Thai installation costs falling about 10% a year — [Reccessary](https://reccessary.com/en/news/Rooftop-solar-emerges-as-standard-feature-in-Thailand-as-installation-costs-fall)

**Global and other benchmarks**
- IRENA RPGC 2024 (Jul 2025) puts the global total installed cost of solar PV at **USD 691/kW** (utility-scale weighted average). Global weighted LCOE is USD 0.043/kWh — [IRENA RPGC in 2024](https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_2025.pdf). Krungsri cites a global installed cost of USD 5.31/W in 2010 falling to USD 0.76/W in 2023 (−13.7%/yr) — [Krungsri Research EN, Jan 2025](https://www.krungsri.com/en/research/research-intelligence/solar-rooftop-2025)
- NREL defines the "commercial rooftop" benchmark as 100 kW–2 MW. The Q1-2024 benchmark exists, but I could not open its figures. The older Q1-2021 benchmark was USD 1.56/Wdc for a 200 kWdc US commercial rooftop (old data, US prices) — [OSTI Q1-2024 Solar Cost Benchmarks](https://www.osti.gov/biblio/3007269)
- Singapore commercial rooftop starts from about SGD 900/kWp for larger systems (vendor) — [Rezeca](https://www.rezeca.com/services/commercial)

**Component split (only residential data found)**
- For a 5 kW residential system of ~180k THB, the split is: panels 47%, inverter 22%, mounting and wiring 13%, labour 12%, permits and fees 6%. Residential grid-connection fees and engineering run 5,000–15,000 THB — [Green Energy Thailand](https://www.greenenergythailand.com/posts/solar-panel-installation-costs/)

**Permits and regulation (affect soft cost and schedule)**
- Systems below 1,000 kVA file an ERC "notification of exempted energy business" (แบบแจ้งการประกอบกิจการพลังงานที่ได้รับการยกเว้น) instead of a full licence. An engineer must check roof structure, and the installation should not count as a building modification — [SCB](https://www.scb.co.th/th/personal-banking/stories/home-car/installing-solar-rooftop-requires-permission.html)
- On 17 Dec 2024 Cabinet approved a draft ministerial regulation that exempts rooftop solar of **any size** from being a "factory" under the Factory Act 2535. Previously systems ≥1,000 kW needed a factory licence (รง.4) — [InfoQuest](https://www.infoquest.co.th/?p=454248); [Krungsri Research TH 2025](https://www.krungsri.com/th/research/research-intelligence/solar-rooftop-2-2025)

### Inferences
- **Recommended base-case turnkey EPC input (excl. VAT, 2026):**
  - ~30–34 THB/Wp at 100 kWp
  - ~20–24 THB/Wp at 500 kWp
  - ~18–23 THB/Wp at 1 MWp
  - ~17–22 THB/Wp at 2 MWp
  - These are interpolated from the Krungsri 100 kW point, Krungsri's 20–25 C&I band, Saimai's 400 kW at 18, and capsolar's 2 MW at 24–26.
  - The capsolar 2 MW figure is above the Saimai 400 kW figure. That contradicts a smooth scale curve, which suggests spec and quality (tier-1 modules, string vs. central inverters, roof works) matter as much as size.
  - Use a ±15% sensitivity.
- **Model as separate lines** rather than one turnkey number:
  - modules
  - inverters
  - mounting
  - DC/AC BOS
  - labour
  - engineering and design
  - site-specific adders: roof reinforcement, waterproofing, zero-export relay, revenue meter, PEA study, monitoring
  - development costs
  - contingency (5–10% is typical engineering practice; no Thai source found)
  - Reason: the site-specific adders, not modules, cause the variance between factories.
- **Scale effect, mechanism:** fixed costs (design, permitting, PEA application, mobilisation, protection relay, revenue meter, monitoring gateway) are near-lump-sum. In THB/kWp they therefore weigh about 10× more at 200 kWp than at 2 MWp. The Krungsri curve (56.7k → 33.5k THB/kW from 3 to 100 kW) confirms the steep part of the curve. Above ~400 kWp the module and inverter share dominates and the curve flattens.
- **VAT:** for an EGAT-owned asset that bills the factory, input VAT (7%) on EPC should be recoverable against output VAT on PPA invoices. Model capex ex-VAT but include a VAT cash-timing item in working capital. This is an inference; no source found.
- **Import duty:** not found. Modules usually come via the EPC, already landed. Check BOI and FTA (ASEAN/China) duty status.

### Gaps
- No Thai published benchmarks were found for:
  - roof structural survey cost
  - roof reinforcement (THB/m² or % of capex)
  - waterproofing and repair
  - zero-export / reverse-power relay cost
  - revenue-grade meter or CT/PT set
  - PEA/MEA connection study and inspection fees for C&I
  - อ.1 building modification permit cost
  - engineering-fee %
  - project development cost
  - typical contingency %
- These need EPC quotes and PEA/MEA fee schedules (the PEA "ระเบียบการเชื่อมต่อ" fee annex).
- No listed Thai developer disclosure of C&I THB/kWp was found. BCPG's 17.5 MW private-PPA rooftop acquisition was located without a price per MW — [BCPG news](https://www.bcpggroup.com/th/newsroom/news/663/bcpg-closes-175-mw-solar-rooftop-private-ppa-deal-advancing-green-energy-expansion).
- The NREL Q1-2024 commercial $/Wdc and component split could not be retrieved (the nrel.gov domain was unreachable).
- Whether the Factory Act exemption regulation has been gazetted needs confirmation.

---

## 2. BESS CAPEX: component costs and turnkey THB/kWh for C&I scale

### Takeaway
Global LFP pack prices collapsed in 2025: the BNEF stationary-storage pack average fell to **USD 70/kWh**, down 45% year on year. Full system prices are still 3–4× pack prices. BNEF's turnkey system survey gives **USD 236/kWh (US)** and **USD 275/kWh (Europe)**. The only Thai C&I installed quotes found are from an installer: **12,000–15,000 THB/kWh in 2026** (≈USD 356–445/kWh), down from 15–18k in 2024. For small C&I projects this means Thai turnkey prices sit at or above US/EU system levels. That leaves room for decline through competitive tendering.

### Cited Findings
- **BNEF 2025 Battery Price Survey:**
  - Stationary storage pack average fell to **USD 70/kWh**, −45% versus 2024. It is now the cheapest segment, which BNEF attributes to Chinese cell overcapacity.
  - All-segment average is USD 108/kWh (−8%).
  - BNEF forecasts a 3% further decline in 2026, to just under USD 105/kWh (all segments).
  - Source: [BNEF press release](https://about.bnef.com/insights/clean-energy/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour); [ess-news](https://www.ess-news.com/?p=7552); [energy-storage.news](https://www.energy-storage.news/li-ion-battery-pack-prices-fell-8-since-last-year-despite-metals-prices-rising-bloombergnef-says/)
- BNEF's separate turnkey Battery Storage System Cost Survey gives **USD 236/kWh (US)** and **USD 275/kWh (Europe)**. This was relayed in search-result summaries; I could not verify the edition or year directly — [BNEF](https://about.bnef.com/insights/clean-energy/lithium-ion-battery-pack-prices/)
- **Thai factory BESS (capsolar, installer, "2026 data"):**
  - All-in installed: **12,000–15,000 THB/kWh**. Historical: 20–25k (2020), 15–18k (2024).
  - LFP cells (+BMS): 7,000–10,000 THB/kWh
  - Hybrid inverter / PCS: **3,000–5,000 THB/kW**
  - Installation and integration (cabling, racking, commissioning): **2,000–3,000 THB/kWh**
  - Fire suppression for indoor installs: **100,000–500,000 THB lump sum**
  - EMS and container: not priced
  - Internal inconsistency: the LFP comparison table gives 10,000–13,000 THB/kWh
  - Source: [capsolar factory BESS](https://capsolar.co.th/en/knowledge/battery-storage-factory-solar)
- Thai residential LFP home batteries run 11,000–15,000 THB/kWh installed. This is a loose reference only — [Green Energy Thailand](https://www.greenenergythailand.com/posts/much-home-battery-storage/)
- Capsolar also cites a global installed range of USD 180–580/kWh (2025–26), with Thailand in the upper half after import and installation. It also cites ~USD 125/kWh all-in for utility-scale outside China and the US, attributed to Ember 2025 (secondary citation) — [capsolar TOU arbitrage](https://capsolar.co.th/en/knowledge/factory-bess-tou-arbitrage-payback-thailand)
- Thailand's storage market lags despite upstream manufacturing support — [energy-storage.news](https://www.energy-storage.news/thailands-energy-storage-market-lags-despite-renewable-push-and-upstream-manufacturing-support/)
- **Lazard:**
  - The 2025 LCOE+ (18th ed., 16 Jun 2025) reports significant year-on-year storage cost declines that offset the 2021–24 increases. Smaller commercial systems cost more but are also falling — [Lazard press release](https://lazard.com/media/0sopmth5/lazard-releases-2025-levelized-cost-of-energyplus-report.pdf)
  - A secondary source cites Lazard C&I (1 MW / 2 h) LCOS of **USD 319–506/MWh**. The edition is unconfirmed (possibly LCOS v10, 2016 — old) — [altiorem](https://altiorem.org/research/lazard-levelized-cost-of-energy/)
- **NREL ATB 2024:**
  - Commercial battery costs come from the same literature review as utility and residential.
  - NREL found no C&I BESS cost projections in the literature.
  - Source: [NREL ATB 2024 commercial battery storage](https://atb.nrel.gov/electricity/2024/commercial_battery_storage) (page could not be fetched; snippet only)
- **BOI:** capsolar says BESS investment is capped at **12 M THB per MW** for incentives under BOI Announcement 3/2568, and also cites a CIT exemption under a category it elsewhere calls retired. Sources conflict; verify with BOI — [capsolar](https://capsolar.co.th/en/knowledge/battery-storage-factory-solar)

### Inferences
- **Recommended base-case Thai C&I turnkey BESS input (2026, ex-VAT):**
  - 0.25–0.5 MW / 0.5–1 MWh: **~11,000–14,000 THB/kWh**
  - 1–2 MW / 2–4 MWh containerised: **~8,000–11,000 THB/kWh**
  - The larger-system figure is inferred from BNEF system costs of USD 236–275/kWh (≈8–9.3k THB/kWh) and a 2025 pack price of USD 70/kWh (≈2.4k THB/kWh).
  - Model as **energy component (THB/kWh) + power component (THB/kW for PCS) + lump sums (EMS, fire system, transformer/switchgear, grid connection)**. Reason: a 2-hour battery and a 1-hour battery of the same kW have very different THB/kWh.
- **Why scale matters more for BESS than for PV:** containerised all-in-one units (≈2–5 MWh per 20 ft container) amortise HVAC, fire suppression, EMS and transformer over many kWh. Small cabinet systems (100–250 kWh) carry the same safety and EMS lump sums over few kWh. The capsolar fire-suppression lump sum of 100–500k THB alone adds 400–2,000 THB/kWh on a 250 kWh system.
- **Forward price input:** BNEF forecasts pack prices −3% in 2026. Thai installed prices fell about 20% from 2024 to 2026 per capsolar. For year-10 augmentation or replacement, a planning assumption of 30–50% real decline in THB/kWh versus 2026 is plausible but not sourced. Run a sensitivity.

### Gaps
- No separately sourced Thai figures were found for:
  - EMS cost
  - HVAC / liquid cooling
  - transformer and MV switchgear
  - containers
  - BOP
  - BESS grid-connection studies (PEA protection review for storage)
- NREL ATB commercial BESS $/kWh and $/kW split not retrieved (site unreachable).
- Lazard 2025 LCOS C&I capex and O&M assumptions not retrieved (energy-storage.news returned 403; PDF not fetched).
- No Thai fire code or standard cost data was found (e.g. NFPA 855 / EIT standard compliance costs).

---

## 3. OPEX: O&M, cleaning, insurance, monitoring, roof rent, asset management

### Takeaway
Solar O&M benchmarks for SEA C&I rooftops run **USD 1–6/kWp/yr (≈34–200 THB/kWp/yr)**, with small (<500 kWp) rooftops 5–15% higher per kWp. BESS fixed O&M benchmarks are higher in % terms: **1–2% of capex/yr** (Thai installer) and **2.5% of capex/yr** (NREL utility-scale, which includes augmentation in some editions). Insurance, roof lease, asset management and billing costs have no good public SEA benchmarks.

### Cited Findings
- **Solar O&M (Electric Bird, Vietnamese O&M provider, 2026):**
  - Basic package: about **USD 1–2/kWp/yr**
  - Comprehensive package: about **USD 3–6/kWp/yr**
  - Rooftops under 500 kWp run **5–15% higher per kWp** than plants over 1 MWp
  - Vendor source; indicative only
  - Source: [Electric Bird solar O&M cost guide](https://electricbird.vn/blogs/solar-om-costs-process-budget/)
- A Lantau Group Philippines corporate-PPA deck uses solar opex of **USD 8.5/kW/yr** for a shopping-mall case. The date is old and the unit is ambiguous — [Lantau Group](https://www.lantaugroup.com/file/ppt_pgen18_cs.pdf)
- Indian C&I rooftop O&M is quoted as INR 300–500/kW/yr, or **1% of EPC cost per year** (2022, India) — [Renewable Watch](https://renewablewatch.in/2022/11/01/the-capex-route/)
- **BESS O&M:**
  - Thai factory BESS O&M: **1–2% of capex/yr** (BMS monitoring + preventive maintenance) — [capsolar](https://capsolar.co.th/en/knowledge/battery-storage-factory-solar)
  - NREL ATB 2024 utility-scale BESS: fixed O&M = **2.5% of capital cost/yr** (in $/kW), no variable O&M. ATB methodology also assumes a battery replacement after 15 years, and the 2023 edition says FOM covers augmentation to keep rated capacity over a 15-year life — [NREL ATB 2024 utility-scale battery](https://atb.nrel.gov/electricity/2024/utility-scale_battery_storage); [ATB 2024 approach](https://atb.nrel.gov/electricity/2024/approach_&_methodology)
- Panel cleaning: a teaser on Green Energy Thailand mentions 500–1,500 THB per cleaning, apparently for residential systems — [Green Energy Thailand](https://www.greenenergythailand.com/posts/solar-panel-installation-costs/)

### Inferences
**Recommended OPEX input lines (Year-1, escalate with CPI ~1–2%/yr)**

| Item | Suggested unit | Indicative range | Basis |
|---|---|---|---|
| PV preventive + corrective O&M | THB/kWp/yr | 150–350 | Comprehensive rate scaled up for small rooftops |
| PV cleaning | THB/kWp/yr | — | Thai dust/haze; likely 2–4 cleanings/yr; no C&I source |
| BESS O&M | % capex/yr | 1.5–2.5 | capsolar; NREL |
| Insurance (all-risk + BI + third-party) | % capex/yr | 0.3–0.5 (PV), higher for BESS | Industry practice; no source found |
| Monitoring / SCADA telecom (SIM, cloud) | — | — | No source found |
| Asset management, billing, metering verification | — | — | No source found |
| Roof lease | THB/m²/yr or THB/kWp/yr | Often zero | Often bundled into the PPA discount |

- **How the PV O&M range is derived:** about 100–200 THB/kWp/yr is the "comprehensive" vendor rate (USD 3–6). Adding the 5–15% small-rooftop premium and Thai cleaning frequency gives the 150–350 range.
- **Do not lump these together:** O&M contract, insurance and asset management should be separate model lines. Each scales differently: O&M with kWp, insurance with capex, admin as a lump sum per contract. That makes small sites disproportionately expensive.
- Property tax under the 2019 Land and Building Tax Act may apply to the PV/BESS asset if it is treated as a building or structure. This is unsourced; get a legal check.

### Gaps
- No Thai or SEA-sourced figures were found for:
  - C&I PV/BESS insurance premium %
  - monitoring and telecom cost
  - rooftop rental rates in Thai PPAs
  - asset management fees
  - billing costs
  - security
  - inverter extended-warranty prices
  - spare-parts budget
- Thai property tax treatment of rooftop PV/BESS owned by a third party was not verified.

---

## 4. Lifecycle: inverter/PCS replacement, battery augmentation/replacement, roof-replacement relocation, decommissioning

### Takeaway
Plan a PV inverter replacement around year 10–12. Plan BESS augmentation or replacement at year 10–15: LFP practical life in Thai climate is 15–18 years, degrading about 2–3%/yr with a typical 80%@10-yr warranty, and NREL assumes full replacement at year 15. Panel life is 25–30 years. Public costs for relocation when a roof is replaced, and for decommissioning and recycling in Thailand, were not found.

### Cited Findings
- PV system life is 25–30 years, with a performance warranty of about 80–90% of initial output over life — [Krungsri Research TH 2025](https://www.krungsri.com/th/research/research-intelligence/solar-rooftop-2-2025)
- **LFP in Thailand (capsolar):**
  - 6,000–10,000 cycles
  - 15–20-yr life, **15–18 yr practical in Thai climate**
  - Warranty 80% capacity at 10 yrs / 6,000 cycles
  - Degradation **~2–3%/yr**
  - The source advises sizing for year-10 capacity
  - Source: [capsolar](https://capsolar.co.th/en/knowledge/battery-storage-factory-solar)
- NREL ATB 2024 cost methodology includes a **full battery replacement after 15 years**. The 2023 edition treats augmentation as part of FOM over a 15-year life — [NREL ATB 2024 methodology](https://atb.nrel.gov/electricity/2024/approach_&_methodology)
- Pack price forecasts: BNEF expects −3% in 2026 (all segments) — [BNEF](https://about.bnef.com/insights/clean-energy/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour). IRENA projects solar PV installed cost toward ~USD 388/kW over the next five years (utility) — [IRENA RPGC 2024](https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_2025.pdf)

### Inferences
- **Inverter replacement:** model a one-time capex in year 10–12 for string inverters. Use the inverter share of capex × an expected price decline. Residential split data puts inverters at ~22% of residential capex; C&I inverter share is likely ~8–12%. An Electric Bird or SolarEdge-type extended warranty can convert this lumpy cost into an annual fee.
- **PCS replacement** for BESS: around year 10–15, priced off 3,000–5,000 THB/kW today minus expected decline.
- **BESS:** choose one of two approaches.
  - (a) Augmentation: add ~10–20% capacity at years 5–8 and again at 10–12 to hold contracted kWh.
  - (b) Full replacement at year 12–15 at future prices.
  - Either way, a PPA term longer than about 15 years with a fixed-capacity guarantee requires a replacement line in the model.
- **Roof replacement / relocation:** many factory metal-sheet roofs will need replacing within a 20–25-yr PPA. The model needs an input for removal + reinstall (THB/kWp) and lost generation for the outage weeks, or a contract clause putting this cost on the host. No Thai benchmark was found. The common market convention of ~10–20% of the original installation labour is an inference and unsourced.
- **Decommissioning and salvage:** include end-of-term removal cost netted against module, aluminium, copper and LFP salvage. Alternatively, structure the contract as a transfer to the factory at a nominal price at term-end, which avoids the removal cost — common in Thai private PPAs, but not verified here.

### Gaps
- No sources were found for:
  - Thai inverter replacement prices
  - relocation cost when a factory replaces its roof
  - PV recycling cost or salvage values in Thailand
  - LFP recycling or second-life value in Thailand
- Battery price forecasts beyond 2026 (BNEF long-term outlook) were not retrieved.

---

## 5. Soft and hidden costs often missed

### Takeaway
Soft costs in a third-party-owned C&I PPA can be large relative to a 0.2–2 MWp asset: customer acquisition and legal, development and permitting, interest during construction, working capital (VAT and billing lag), and credit enhancement. They are mostly undocumented in public Thai sources and must be estimated internally from EGAT's own deal costs.

### Cited Findings
- Thai C&I PPA models offer the customer zero upfront investment, with the provider taking most risk and billing on actual consumption. Every cost item therefore sits on the provider's (EGAT's) balance sheet — [capsolar financing page](https://capsolar.co.th/th/knowledge/solar-financing-thailand-factory)
- Thai regulatory process for rooftops <1,000 kVA is an ERC exemption notification, not a licence. Since the 17 Dec 2024 Cabinet decision, rooftops need no factory licence. This cuts permitting soft cost and time versus earlier years — [SCB](https://www.scb.co.th/th/personal-banking/stories/home-car/installing-solar-rooftop-requires-permission.html); [InfoQuest](https://www.infoquest.co.th/?p=454248)
- Private capital commitments to Thai rooftop (e.g. 5.6 bn and 32 bn THB investment headlines) show competitive pressure on PPA discounts — [Thansettakij 663849](https://www.thansettakij.com/sustainable/net-zero/663849); [Thansettakij 661797](https://www.thansettakij.com/economy/energy/661797)

### Inferences
**Hidden-cost checklist for the model**
1. Customer acquisition: sales and BD time, energy audit, load-profile analysis.
2. Legal: PPA drafting and negotiation, land/roof-use agreement, registration.
3. Development: site survey, structural engineer report, PEA/MEA application and studies.
4. Interest during construction (IDC): 3–6 months of construction at EGAT's cost of debt.
5. Working capital:
   - monthly billing cycle plus 30–60-day payment terms
   - VAT timing
   - O&M prepayments
6. Credit enhancement for factory default risk, via one of:
   - bank guarantee or deposit (often 1–3 months of PPA billing)
   - credit insurance
   - a credit-risk premium in the discount rate
7. Early-termination / host-closure risk: probability × unrecovered capex. Make this a scenario input, since factories close or relocate within 20 years.
8. Performance guarantee shortfall payments, if EGAT guarantees kWh or savings.
9. Measurement and verification for shared-savings contracts (baseline adjustment), which is a recurring cost.

- For a 200 kWp project (~5–6.5 M THB capex), fixed soft costs of even 200–300k THB add 4–6% to capex. On a 2 MWp project the same costs are <1%. This is the main reason minimum project size matters.

### Gaps
- No public Thai data was found on:
  - C&I PPA customer-acquisition or legal cost per contract
  - typical guarantee and deposit requirements
  - default rates of Thai SME/mid-size factory offtakers
  - typical construction period
- These should come from EGAT internal data or developer interviews.

---

## 6. Is "≤1% of investment per year O&M" realistic?

### Takeaway
For **solar PV O&M alone**, 1% of capex/yr (≈180–250 THB/kWp/yr at 18–25 THB/Wp) is **realistic, even slightly generous**. It sits at the top of the SEA vendor range of USD 1–6/kWp/yr and matches the Indian "1% of EPC" convention. But if "O&M" is meant to cover **all** opex (insurance, monitoring, asset management, billing, cleaning, inverter reserve), 1% is **too low**; ~1.5–2% is more defensible. For **BESS**, ≤1% is **not supported**: benchmarks are 1–2% (Thai installer) and 2.5% (NREL), before augmentation.

### Cited Findings
- SEA solar O&M runs USD 1–6/kWp/yr, with small rooftops 5–15% higher — [Electric Bird](https://electricbird.vn/blogs/solar-om-costs-process-budget/)
- India rooftop C&I O&M ≈ 1% of EPC per year (2022) — [Renewable Watch](https://renewablewatch.in/2022/11/01/the-capex-route/)
- Thai C&I capex is 20–25 THB/Wp — [Krungsri Research TH 2025](https://www.krungsri.com/th/research/research-intelligence/solar-rooftop-2-2025)
- Thai factory BESS O&M is 1–2% of capex/yr — [capsolar](https://capsolar.co.th/en/knowledge/battery-storage-factory-solar)
- NREL utility BESS fixed O&M is 2.5% of capex/yr — [NREL ATB 2024](https://atb.nrel.gov/electricity/2024/utility-scale_battery_storage)

### Inferences
- **Conversion:** USD 1–6/kWp/yr × 33.7 = 34–202 THB/kWp/yr. Against capex of 20,000 THB/kWp, that is **0.17–1.0%/yr**, so 1% equals the top of the "comprehensive" vendor range.
- **A % of capex rule is misleading** for two reasons:
  - Small sites have higher fixed O&M per kWp.
  - As capex falls (≈10%/yr per Reccessary), O&M labour does not fall in step.
  - Better: specify PV O&M in **THB/kWp/yr with an escalator**, and BESS in **% of capex or THB/kW/yr**, plus separate insurance and admin lines.
- **Suggested all-in opex base cases:**
  - Solar PPA: **~1.2–1.8% of capex/yr** (O&M ~0.8–1.0% + insurance ~0.3–0.5% + monitoring and admin), plus an inverter reserve
  - BESS: **~2–3% of capex/yr**, plus an augmentation/replacement reserve
  - These include unsourced judgement components (insurance, admin); flag them as assumptions.

### Gaps
- The insurance and asset-management components of the proposed all-in opex lack public SEA sources.
- No Thai utility or ERC guidance on standard O&M percentages for C&I rooftops or BESS was found.
- Krungsri, KResearch and SCB EIC do not publish O&M % for C&I in the notes found.
