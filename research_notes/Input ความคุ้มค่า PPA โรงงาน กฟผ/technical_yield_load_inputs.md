# Technical, Energy-Yield and Load Inputs for Behind-the-Meter C&I Solar PV + BESS Feasibility at Thai Factories (EGAT-owned, PPA / shared-savings)

Scope note: research run 2026-11-09. Searches covered NREL, Solargis, PNNL, PEA tariff documents, Thai academic papers (KMUTT, ThaiJO), and vendor sources. Several primary NREL pages (atb.nrel.gov) could not be fetched (DNS failure), so some BESS figures stay as gaps rather than numbers. Vendor and blog figures are labelled as such.

## 1. Solar resource and yield (GHI/POA, specific yield, PR, P50/P90, soiling, temperature, degradation, clipping, seasonality)

### Takeaway
For Thai rooftops, a defensible P50 specific yield is about 1,350-1,500 kWh/kWp/yr, with measured performance ratio (PR) of about 70-80%. Simulated PRs run higher, up to 87%. Thai field data shows module degradation well above the global 0.5%/yr median: 0.3-1.9%/yr for most modules and up to 4.9%/yr for some. A model that copies the global default of about 0.5%/yr, or a PR of 85%+ from a design-software run, will overstate EGAT revenue. P90 rather than P50 should be used for downside/debt cases.

### Cited Findings
**Resource / specific yield**
- Global Solar Atlas (GSA) estimate for Pak Kret, Nonthaburi: PVOUT 1,452.6 kWh/kWp/yr (about 3.98 kWh/kWp/day), capacity factor about 16.6%. — [AJISE paper using GSA](https://journals.e-palli.com/home/index.php/ajise/article/download/8726/4199/54698)
- GSA/Solargis data is "not fully validated in many developing countries" because of a lack of ground measurements. This is a reason to treat satellite yield as having material model uncertainty in Thailand. — [same source](https://journals.e-palli.com/home/index.php/ajise/article/download/8726/4199/54698); World Bank/ESMAP GSA PVOUT dataset: [energydata.info](https://energydata.info/en/dataset/dashboard/world-photovoltaic-power-potential-pvout-gis-data-global-solar-atlas)
- PVsyst simulation, industrial rooftop at PTTGC, Rayong (EEC): specific yield 1,526 kWh/kWp/yr, PR 87.43%. BTS Skytrain station rooftop: 1,380 kWh/kWp/yr, PR 77.2%. 1.85 MWp commercial rooftop design: 1,442 kWh/kWp/yr, PR 80%. — Thai studies indexed via ThaiJO search: [ThaiJO IJSIT](https://ph01.tci-thaijo.org/index.php/IJSIT/article/view/268562), [ThaiJO TSU journal](https://ph02.tci-thaijo.org/index.php/tsujournal/article/view/265261), [RMUTSB](https://li01.tci-thaijo.org/index.php/rmutsb-sci/article/download/249697/173071/905516) (individual attribution of each number to each paper was from search summary; verify before quoting)
- Multi-region Thai study (utility-scale, different module technologies): PR 71.1%-84.5%; yields about 1,361-1,635 kWh/kWp/yr. — [IJSIT ThaiJO](https://ph01.tci-thaijo.org/index.php/IJSIT/article/view/268562)
- NASA POWER-based site tool (profilesolar) shows Thai locations at 5.3-5.8 kWh/kWp/day (≈1,920-2,120 kWh/kWp/yr). Highest output is in "spring" (Mar-May, e.g., Bangkok 6.05 kWh/kWp/day), lowest in "autumn" (Sep-Nov, e.g., Chumphon 4.35, Tha Mai 4.48). — [profilesolar Thailand](https://profilesolar.com/countries/TH/). **Conflict:** these annual totals are about 35-45% above GSA and measured Thai data. They likely assume ideal tilt and few losses. Use them only for seasonal shape, not annual yield.

**Measured PR / temperature**
- 9.8 kWp rooftop, northern Thailand, IEC 61724 evaluation: PR 70-80% through the year, final yield 3.42-3.6 kWh/kWp/day (≈1,250-1,310 kWh/kWp/yr). Orientation affects output. — [KMUTT, Techno evaluation on 9.8 kWp rooftop at various orientations](https://kirim.kmutt.ac.th/converis/portal/detail/Publication/601031074?lang=en_GB)
- 32.4 kWp multi-Si rooftop, Bangkok (Chitralada Institute): PR 0.712; temperature loss factor 0.067 (about 6.7%). — [TEE Journal, ThaiJO](https://ph04.tci-thaijo.org/index.php/TEE_J/article/view/7696)
- 3.5 kWp rooftop, Tak: 3.81 kWh/kWp/day final yield, measured over only 2 weeks (Dec 2015). Not representative of a full year. — [IMECS 2016](https://www.iaeng.org/publication/IMECS2016/IMECS2016_pp572-575.pdf) (older data, flagged)

**Soiling**
- Rice-farm-adjacent site (KMUTT): soiling loss about 3-4% per month in the dry season. — [KMUTT, Dust accumulation in tropical climate and rice-farm environment](https://kirim.kmutt.ac.th/converis/portal/detail/Publication/779626801?lang=en_GB)
- Five Thai PV units: dust-opaque area 11-14% after 1-2 weeks of exposure. Cleaning raised energy output by about 10%. PR was stable in the rainy season (natural washing). — [PIT journal, ThaiJO](https://ph03.tci-thaijo.org/index.php/pitjournal/article/download/951/629/4731)
- Nakhon Ratchasima study: twice-monthly cleaning was economically reasonable. It notes commercial software typically assumes a 3% soiling loss. — [search summary of Thai study, Scribd](https://www.scribd.com/document/717556370/Science-Article)
- Phitsanulok area: 7.11% power loss over 34 rain-free days. One Thai site near road construction recorded 15% energy loss in February (2015 IEEE paper). — [ISC index](https://search.isc.ac/Inventory/49/3711265.htm) (older, flagged)

**Degradation (Thailand vs global)**
- Global: Jordan & Kurtz (NREL) review of about 2,000 field rates: median 0.5%/yr, mean 0.8%/yr (long tail of weak products). — [NREL Photovoltaic Degradation Rates - An Analytical Review](https://research-hub.nrel.gov/en/publications/photovoltaic-degradation-rates-an-analytical-review-2/); [NREL 2015 slides](https://www.nrel.gov/docs/fy15osti/65040.pdf)
- NREL 2023 flash-test study of newer modules: mean 0.62%/yr, median 0.58%/yr. — [NREL fy23osti/82352](https://nrel.gov/docs/fy23osti/82352.pdf)
- Thailand, Limmanee et al. 2016 (Renewable Energy): degradation 0.5-4.9%/yr across module types, implying 10-50% output loss over 25 years. — [RePEc, Renewable Energy v89](https://ideas.repec.org/a/eee/renene/v89y2016icp12-17.html)
- Thailand Science Park, Limmanee et al. 2017 (73 modules, 4 years): most technologies 0.3-1.9%/yr. Some micromorph thin-film failed. — [RePEc, Renewable Energy v102](https://econpapers.repec.org/RePEc:eee:renene:v:102:y:2017:i:pa:p:199-204)
- Aziz, Ketjoy & Sirisamphanwong (2014): 9-14-year-old mono-Si/poly-Si lots degraded about 2-3.9%/yr, versus 0.8-1%/yr warranty figures. — [ISC index](https://manuscript.isc.ac/Inventory/49/150912.htm) (older)
- PVSEC-36 (2025), Chenvidhya et al.: utility plants at years 5-8 showed Pmax loss of 3.2% (central site) vs 8.6-11.8% (northern site), attributed to hot-humid stress. A Bangkok 2017-2022 field-vs-lab study (Sangpongsanont et al.) exists, but its number was not retrieved. — [KMUTT EL imaging study](https://kirim.kmutt.ac.th/converis/portal/detail/Publication/1533542899?lang=de_DE); [KMUTT field vs lab degradation](https://kirim.kmutt.ac.th/converis/portal/detail/Publication/1533574500?lang=en_GB)

**P50 / P90**
- P90 = yield exceeded with 90% probability (not the statistical 90th percentile). Under a normal distribution, P90 = P50 − 1.282 × σ. — [Solargis, How to calculate P90](https://solargis.com/blog/best-practices/how-to-calculate-p90-or-other-pxx-pv-energy-yield-estimates); [Solargis KB P50/P90](https://kb.solargis.com/docs/p50-p90-and-other-scenarios)
- Interannual variability should be computed from ≥10 years of data. For a multi-year (N-year) P90, σ_interannual is divided by √N. Solargis example: interannual variability of annual GHI ±2.6% and of PVOUT 3.2%, combined by root-sum-square with model and simulation uncertainty. — [Solargis blog](https://solargis.com/blog/best-practices/how-to-calculate-p90-or-other-pxx-pv-energy-yield-estimates)
- Lenders size debt so that DSCR holds under conservative production cases (P90, 1-yr or 10-yr). Practice varies, and no single universal cutoff was found. — [PV Tech, PV yield uncertainty for lenders](https://www.pv-tech.org/pv-yield-uncertainty-what-it-means-for-engineers-lenders-and-investors/)

**DC/AC ratio and clipping**
- Peer-reviewed: clipping at DC/AC 1.3 can reach about 3% of production (monofacial). The optimum is usually 1.2-1.3. — [MDPI Energies 17(22):5658](https://mdpi.com/1996-1073/17/22/5658)
- A vendor summary of an NREL minute-resolution study (Anderson et al. 2022) gives about 1.2% clipping at ILR 1.30 fixed-tilt. It notes that hourly models underestimate clipping. Other vendor pages give 2-5% (conflicting). — [SurgePV](https://www.surgepv.com/blog/solar-inverter-clipping-dc-oversizing)

### Inferences
- **Error magnitudes for the model:**
  - Using a PVsyst-style PR of 85-87% instead of a measured Thai PR of about 75-80% overstates year-1 kWh by about 6-15%. Revenue and IRR are almost linear in kWh.
  - Using a 0.5%/yr degradation when Thai field reality is about 1%/yr gives about 11% vs 22% cumulative loss by year 25. That is roughly a 5-7% overstatement of lifetime kWh, and more in later years.
  - Ignoring soiling (3-7% in the dry season, which coincides with the highest-irradiance months Jan-Apr) overstates yield in exactly the months that drive revenue.
- **Seasonality matters for monthly cash flow and for BESS sizing.** Mar-May is peak yield, and Sep-Nov (monsoon tail) is the lowest. Monthly irradiance must be modelled, not an annual average divided by 12.
- **Input table, solar side (name | unit | why it matters | typical Thai value | source):**
  - Site GHI and POA irradiance, hourly TMY | kWh/m² | base of all yield; POA depends on tilt/azimuth of the actual roof | GSA PVOUT about 1,400-1,550 kWh/kWp in central/east; verify per site | Global Solar Atlas, Solargis, DEDE solar map, NASA POWER (shape only)
  - Specific yield P50 | kWh/kWp/yr | drives revenue | 1,350-1,500 (rooftop, real roofs) | GSA + PVsyst/SAM per site; Thai studies above
  - Performance ratio | % | sanity check on simulation | measured 70-80%, simulated 77-87% | Thai studies above
  - P90 (1-yr and 10-yr) | kWh/yr | downside and lender case | P50 × (1 − 1.282σ); σ total likely 5-8% (see Gaps) | Solargis method
  - Temperature loss / module temp coefficient | %/°C, % | Thai cell temperatures are high | about 6.7% annual temp loss measured in Bangkok | TEE Journal
  - Soiling loss and cleaning frequency | %/month, cleanings/yr | dry-season loss; O&M cost trade-off | 3% software default; 3-4%/month in the dry season; up to 7-15% near dust sources | KMUTT, PIT journal
  - Year-1 degradation (LID/LeTID) + annual degradation | %, %/yr | lifetime kWh | Thai field data 0.3-1.9%/yr for most c-Si; use ≥0.7-1.0%/yr base, 0.5% optimistic, 1.5% stress | Limmanee 2016/2017; NREL
  - DC/AC ratio and clipping | ratio, % | over-sizing gain vs clipping | 1.2-1.3; clipping 1-3% | MDPI; NREL via SurgePV
  - Roof orientation/tilt and shading | °, % | real rooftops are rarely optimal; orientation changes yield | site survey/drone + PVsyst shading scene | KMUTT orientation study
  - System availability | % | inverter outages, roof works | see Gaps | contract/O&M data

### Gaps
- No authoritative Thailand-wide or region-by-region GSA PVOUT table was retrieved. The ESMAP "Global Photovoltaic Power Potential by Country" (2020) country factsheet should be checked directly. DEDE's solar map values were not retrieved.
- Thai-specific interannual GHI variability (σ) was not found. The Solargis 2.6-3.2% example is generic. A total P90 uncertainty (resource + model + losses) for Thai rooftops was not found. A common industry rule of thumb (P90 ≈ 92-95% of P50 for 1-yr) is unverified here.
- LID/LeTID first-year loss values and current Tier-1 warranty terms (e.g., year-1 ≤1-2%, then about 0.4-0.55%/yr for n-type TOPCon) were not sourced in this session. Pull from manufacturer datasheets (Jinko, LONGi, Trina).
- Plant availability benchmarks for Thai C&I rooftop (commonly 98-99.5% contracted) were not sourced.
- Bifacial/rooftop albedo and module mismatch/wiring losses were not researched.

## 2. Load and self-consumption (hourly profiles, self-consumption ratio, zero export, calendar, load risk)

### Takeaway
PEA bills C&I customers on the highest **15-minute** average kW in the peak window (09:00-22:00 Mon-Fri). Peak/off-peak energy prices differ by about 1.6-1.7 THB/kWh. A 70% demand ratchet and a kVAR-based power-factor charge also apply. Savings therefore depend on *when* solar/BESS energy lands against the factory's interval load. Annual or monthly kWh totals cannot capture curtailment, weekend surplus, demand-charge savings, or ratchet effects. At least 12 months of 15-min interval (AMR) data is the essential input.

### Cited Findings
- PEA tariff (effective May 2023 bills): category 3 (medium general service) applies at 30-<1,000 kW maximum 15-min demand and ≤250,000 kWh/month. Category 4 (large) applies at ≥1,000 kW or >250,000 kWh/month. Demand is defined as "the maximum of an average integrated demand of energy in 15 minutes". — [PEA Electricity Tariffs May 2023 (EN)](https://www.pea.co.th/sites/default/files/documents/tariff/EN_Electricity_Tariffs_May_2023.pdf)
- PEA TOU rates 3.2 / 4.2 (same for both categories), as demand charge (THB/kW) / peak energy / off-peak energy (THB/kWh): ≥69 kV 74.14 / 4.1025 / 2.5849; 22-33 kV 132.93 / 4.1839 / 2.6037; <22 kV 210.00 / 4.3297 / 2.6369. Service charge 312.24 THB/month; Ft and VAT are extra. — [PEA tariff May 2023](https://www.pea.co.th/sites/default/files/documents/tariff/EN_Electricity_Tariffs_May_2023.pdf)
- TOU peak is 09:00-22:00 Mon-Fri (and Royal Ploughing Ceremony Day). Off-peak is 22:00-09:00 Mon-Fri plus 24 h on Sat, Sun, Labour Day and public holidays (except compensatory holidays). — [PEA tariff May 2023](https://www.pea.co.th/sites/default/files/documents/tariff/EN_Electricity_Tariffs_May_2023.pdf); [EPPO TOU](https://www.eppo.go.th/index.php/th/electricity/define-electricity/tou)
- Minimum charge: not lower than 70% of the maximum demand charge in the last 12 months, ending in the current month (a ratchet). — [PEA tariff May 2023](https://www.pea.co.th/sites/default/files/documents/tariff/EN_Electricity_Tariffs_May_2023.pdf)
- Power-factor charge: 56.07 THB/kVAR when maximum 15-min kVAR exceeds 61.97% of maximum 15-min kW. — [PEA tariff May 2023](https://www.pea.co.th/sites/default/files/documents/tariff/EN_Electricity_Tariffs_May_2023.pdf)
- Metering on the LV side of the customer's transformer adds 2% to kW and kWh. — [PEA tariff May 2023](https://www.pea.co.th/sites/default/files/documents/tariff/EN_Electricity_Tariffs_May_2023.pdf)
- Vendor-reported example: 300 kWp rooftop at a Samut Prakan electronics plant with about 83% self-consumption. Modelled battery demand-charge savings of about 380,000 THB/yr for a 500 kW peak-demand factory (vendor blog, not audited). — [CapSolar Thailand blog](https://capsolar-thailand.blogspot.com/2026/04/peak-demand-charges-and-solar-energy.html)
- KMUTT measured one year of a residential PV-battery system under Thai TOU. PV+battery covered about a quarter of demand but delivered nearly a third of cost savings, because of on-peak self-sufficiency. This shows time-of-delivery value differs from energy share. — [KMUTT, PV-battery under TOU](https://kirim.kmutt.ac.th/converis/portal/detail/Publication/1533262426?lang=en_GB)
- Thai factory rooftop systems registered under JCM (2016) were designed for on-site self-consumption. — [GEC JCM project](https://gec.jp/jcm/projects/16pro_tha_08/) (older)

### Inferences
- **Why 8760 / 15-min matters (worked logic from the tariff):**
  - On a weekend or holiday, every solar kWh is valued at the off-peak rate (≈2.60 THB) rather than the peak rate (≈4.18 THB), and any surplus above load is curtailed under zero-export. A model using an annual-average tariff or monthly kWh overstates value on the about 115+ off-peak days per year (104 weekend days plus public holidays).
  - A factory that runs one shift (08:00-17:00, 5 days) will have large weekend surplus. A 24/7 plant absorbs nearly all solar. Self-consumption ratio can swing from about 60% to about 100%, and EGAT's PPA revenue (if paid only per kWh consumed) swings with it.
- **Demand-charge savings from solar alone are unreliable.** The bill uses the single highest 15-min interval in the month inside 09:00-22:00. One cloudy interval, or factory peaks after sunset (until 22:00), keeps the peak unchanged. A BESS is needed to firm demand savings. The 70% ratchet means a single missed peak can lock in charges for up to 12 months.
- **Power-factor trap (important, often ignored):** solar and BESS reduce kW drawn from the grid but not kVAR. The kVAR/kW ratio rises and can cross the 61.97% threshold, triggering 56.07 THB/kVAR charges that erode factory savings. Inputs needed: 15-min kVAR history and whether the inverter/PCS can supply reactive power.
- **Input table, load side (name | unit | why | typical Thai value | source):**
  - 15-min interval load (kW, kVAR), ≥12 months | kW, kVAR per 15 min | self-consumption, curtailment, demand and PF charges | from the PEA/MEA AMR meter (category 3/4 customers have demand meters) | PEA/MEA meter data, factory BMS/SCADA
  - Tariff category and voltage level | — | sets demand charge 74-210 THB/kW and energy rates | 3.2.x or 4.2.x | PEA/MEA bill
  - Shift pattern, weekday/weekend/holiday calendar, annual shutdowns | h/day, days/yr | drives weekend surplus | factory-specific | factory production plan, Thai holiday calendar
  - Self-consumption ratio (solar consumed on site / solar produced) | % | PPA revenue base under zero export | about 60-100%; vendor case 83% | computed from the 8760/15-min simulation
  - Export allowed? (zero export / curtailment) | kW limit | surplus wasted or paid | see Gaps (PEA rules not retrieved) | PEA interconnection rules, ERC
  - Load growth/decline and closure risk | %/yr, probability | multi-year PPA volume risk | factory-specific | factory business plan, credit assessment
  - Meter position (HV vs LV side of transformer) | — | +2% adder on kW/kWh | site-specific | PEA tariff note

### Gaps
- The current (2025-2026) PEA/MEA rules for C&I rooftop interconnection, zero-export/anti-reverse-power requirements, and whether net-billing exports are allowed for private PPA systems were not retrieved. Searches returned only news items. ERC/PEA regulations must be checked directly.
- The tariff tables are from the May 2023 PEA document. Rates after 2023 and the current Ft were not verified (likely covered by a tariff researcher).
- No audited Thai factory dataset quantifying revenue error from monthly vs 15-min modelling was found. The error direction is inferred from tariff structure, not measured.
- MEA tariff details (Bangkok/Nonthaburi/Samut Prakan) were not verified separately. A secondary source attributes the 132.93 THB/kW figure to MEA ([Banpu NEXT](https://banpunext.co.th/what-is-peak-demand-charge/)), which suggests similar structures.

## 3. BESS technical inputs (usable capacity, DoD, RTE, aux load, degradation, augmentation, warranty, dispatch)

### Takeaway
BESS economics depend on degradation-aware dispatch modelling. Warranties for LFP typically guarantee 70-80% retained capacity at 10 years or about 6,000 cycles (whichever first), under specified DoD, C-rate and temperature. Headline round-trip efficiency figures often exclude HVAC/auxiliary loads, which matter in Thailand's heat. Augmentation must be modelled explicitly, either as capex events or as fixed O&M (NREL ATB folds augmentation into FOM).

### Cited Findings
- NREL ATB 2024 (utility-scale battery): covers 2-10 h durations, built from a review of 16 sources (2022-2023). Round-trip efficiency is set per Cole & Karmakar (2023). Degradation is handled through fixed O&M that **includes augmentation costs so the system keeps rated capacity over a 15-year life**. — [NREL ATB 2024 utility-scale battery storage](https://atb.nrel.gov/electricity/2024/utility-scale_battery_storage) (page could not be fetched directly, so the RTE value was not retrieved). The 2019 ATB used 85% RTE as representative. — [NREL ATB 2019 archive](https://atb-archive.nrel.gov/electricity/2019/index.html?t=st) (older)
- NREL's "Cost Projections for Utility-Scale Battery Storage: 2025 Update" includes RTE among its parameters. Values were not retrieved. — [NREL fy25osti/93281](https://docs.nrel.gov/docs/fy25osti/93281.pdf)
- PNNL (2024): lithium-ion has higher efficiency, but "parasitic loads like HVAC often not included" in quoted efficiency. The PNNL Energy Storage Cost and Performance Database v2024 covers LFP and NMC. LCOS is expressed per kWh of discharge throughput. — [PNNL energy storage overview, NWESS Apr 2024](https://wp.ece.uw.edu/wp-content/uploads/sites/29/2024/05/05.-PNNL-Energy-Storage-Overview-NWESS-April-2024.pdf); [PNNL ESGC database](https://www.pnnl.gov/projects/esgc-cost-performance)
- REopt (NREL) work incorporates battery degradation costs into dispatch/economics. Ignoring degradation in dispatch optimisation overstates value. — [OSTI 1984838](https://www.osti.gov/biblio/1984838)
- Field experience review of utility BESS (IEEE Access 2026) examines real-world RTE and degradation from operating data. Results not extracted. — [UK SPARK / IEEE Access 2026](https://sparklab.engr.uky.edu/sites/spark/files/2026-07/UK%20SPARK%20PPL%20Utility%20Scale%20BESS%20Field%20Experience%20Technology%20Review%20IEEE%20Access%202026.pdf)
- LFP warranty examples:
  - Luxpower: 10 years or 6,000 cycles, whichever first, retaining 70% of usable energy. — [Luxpower warranty 2025](https://luxpowertek.com/wp-content/uploads/2025/04/LuxpowerTek-Battery-Warranty-Terms_Global_241226.pdf)
  - Pylontech: 10 years, >6,000 cycles at 80% EOL. — [Pylontech spec listing](https://frankiesautoelectrics.com.au/product/pylontech-us3000c)
  - Pytes: 6,000 cycles tested at 0.5C, 25 °C, 90% DoD. — [Pytes](https://www.pytesess.com/lfpbattery/123.html)
  - Fortress: 6,000 cycles at 80% DoD or 2,000 cycles at 100% DoD. — [Fortress warranty](https://media.unboundsolar.com/app/uploads/media/2022/02/08123822/189892020-20UNBOUND20Battery20Bank20Fortress20eFlex2021.6kWh2048VDC20LFP202842920Warranty.pdf)
  (These are residential/small-commercial products, used as indicative only.)
- C&I warranty checklist: confirm whether the warranty is in equivalent full cycles, energy throughput or years. Confirm the underlying DoD, C-rate, operating temperature and EOL threshold (often 70% or 80%). Throughput warranties expire at whichever limit is hit first. — [PVB, BESS warranty for C&I buyers](https://www.pvb.com/?p=21454)

### Inferences
- **Input table, BESS (name | unit | why | typical value | source):**
  - Nameplate vs usable energy (DoD/SoC window) | kWh, % | revenue scales with usable kWh; SoC limits (e.g., 5-95%) cut usable energy 10% vs nameplate | warranty DoD 80-90% | datasheet/warranty
  - Round-trip efficiency AC-AC incl. PCS and transformer | % | each arbitrage kWh loses RTE; 85% vs 90% RTE changes the arbitrage margin materially | about 85% (2019 ATB, older); verify current | NREL ATB/NREL 2025 update, vendor test
  - Auxiliary/HVAC load | kWh/day or % of throughput | PNNL notes RTE often excludes HVAC; Thai ambient 30-38 °C raises cooling load; aux draws grid energy at TOU prices (including peak demand) | see Gaps | vendor spec, PNNL
  - Cycle and calendar degradation | %/cycle, %/yr | capacity fade reduces arbitrage and peak-shaving firmness over time | warranty 70-80% at 10 yr / 6,000 cycles | warranty sheets, SAM/REopt degradation models
  - Cycles per day (dispatch-driven) | cycles/day | Thai TOU (one peak window 09:00-22:00) mostly supports about 1 cycle/weekday; 6,000 cycles ≈ 23 years at 260 cycles/yr, so calendar ageing and years limit likely bind first | ~260 equivalent cycles/yr (inference) | dispatch simulation
  - C-rate and PCS rating | C, kW | 0.5C (2 h) vs 0.25C (4 h); PCS kW sets peak-shaving depth | 0.5C typical in warranty tests | datasheet
  - EOL capacity and augmentation plan | %, THB, year | either augment (capex in year ~8-12) or accept fade; ATB treats as FOM | — | NREL ATB method
  - Warranty terms (years, cycles, throughput MWh, temperature) | — | whichever limit binds first ends cover | 10 yr typical | vendor
  - Dispatch strategy | — | TOU arbitrage (charge off-peak 22:00-09:00 / solar, discharge peak) vs peak-shaving the 15-min maximum demand vs backup; peak-shaving needs forecasting margin because one missed interval sets the month's bill and the 70% ratchet | — | PEA tariff + EMS logic
- **Arbitrage spread check (from tariff):** 22-33 kV peak 4.1839 vs off-peak 2.6037 gives a spread of 1.58 THB/kWh before losses. At 85% RTE, the effective margin per discharged kWh ≈ 4.1839 − 2.6037/0.85 ≈ 1.12 THB/kWh, before degradation and aux. This shows why RTE and aux inputs are not second-order. (Calculation from [PEA tariff](https://www.pea.co.th/sites/default/files/documents/tariff/EN_Electricity_Tariffs_May_2023.pdf); RTE assumption from [ATB 2019](https://atb-archive.nrel.gov/electricity/2019/index.html?t=st).)

### Gaps
- Current (2024-2026) NREL ATB / NREL 2025 RTE values, PNNL LFP RTE and HVAC parasitic numbers, and Lazard LCOS 2024/2025 assumptions were **not retrieved** (fetch failures/no numbers in snippets). Fill from those documents directly.
- No C&I-scale (≥250 kWh, containerised) LFP warranty sheet from Tier-1 suppliers (CATL, BYD, Sungrow, Huawei) was retrieved. Typical C&I terms (e.g., 10-15 yr, throughput-capped, 25 °C ±) need confirmation.
- No Thai field data on BESS degradation, HVAC load or fire-code (DPT/Thai fire standards) requirements was found.
- Calendar vs cycle degradation split for LFP at 30-35 °C ambient was not quantified.

## 4. Hybrid specifics (DC- vs AC-coupled, charging from solar surplus vs grid, interaction effects)

### Takeaway
Sources found here are thin. The key interaction comes from the tariff and zero-export context. Weekend and holiday solar surplus (otherwise curtailed) is the "free" charging energy for a BESS. On weekdays, solar usually serves load during the 09:00-22:00 peak, so the battery competes with solar for daytime value and mainly earns from evening-peak (17:00-22:00) shifting and 15-min demand capping.

### Cited Findings
- KMUTT one-year measured PV-battery system under Thai TOU: battery value is concentrated in on-peak self-sufficiency (about a quarter of energy, nearly a third of savings). — [KMUTT](https://kirim.kmutt.ac.th/converis/portal/detail/Publication/1533262426?lang=en_GB)
- Panasonic Energy Thailand: 50 kW hybrid inverter (DC-coupled hybrid) with 3 × 102.4 kWh batteries for TOU energy management. Specs only, no performance data. — [SolarQuarter, GoodWe-Panasonic Thailand](https://solarquarter.com/2025/10/22/goodwe-powers-panasonic-thailand-facility-with-advanced-solar-plus-storage-solution/amp/)
- Hourly models underestimate inverter clipping relative to minute-resolution data. That matters for DC-coupled systems, where clipped DC energy can be routed to the battery. — [SurgePV summarising NREL Anderson et al. 2022](https://www.surgepv.com/blog/solar-inverter-clipping-dc-oversizing) (vendor summary)

### Inferences
- **Inputs:**
  - Coupling architecture (AC vs DC): DC-coupled can capture clipped energy and avoid one conversion (higher solar-to-battery efficiency). AC-coupled is easier to retrofit and separates warranties/ownership.
  - Charging source rule (solar-only vs grid-allowed): this affects any tax/green-attribute claims and the cost of charged energy (off-peak grid at about 2.60 THB vs curtailed solar at about 0).
  - Priority logic: solar → load → battery → curtail. These interaction effects mean Solar+BESS savings ≠ Solar-only savings + BESS-only savings. They must be co-simulated on the same 15-min profile.
- For the three EGAT products, the **Battery-only** case is driven purely by the arbitrage spread, 15-min demand reduction and ratchet. **Solar+Battery** gains the curtailment-recovery value on weekends/holidays and solar-ramp smoothing of peaks.

### Gaps
- No quantitative source compared DC- vs AC-coupled efficiency or capex for Thai C&I. Typical efficiency differences (a few %) are unverified here.
- PEA rules on whether a BTM battery may charge from the grid under a third-party-owned PPA arrangement, and any metering requirements, were not found.

## 5. Simulation tools and standards (SAM, PVsyst, HOMER, REopt, IEC 61724, lender due diligence)

### Takeaway
Industry practice is to run PVsyst (bankable PV yield, losses, shading) or NREL SAM (PV + battery + financials at hourly/sub-hourly time steps), with REopt/HOMER for sizing optimisation. Performance is verified against IEC 61724 PR metrics. Lenders and technical due diligence expect P50/P90 from multi-year satellite data with documented loss assumptions.

### Cited Findings
- IEC 61724 is the standard used to evaluate Thai rooftop performance (PR, final yield) in academic monitoring. — [KMUTT 9.8 kWp study](https://kirim.kmutt.ac.th/converis/portal/detail/Publication/601031074?lang=en_GB)
- PVsyst is used in Thai industrial rooftop design studies (e.g., PTTGC Rayong). It generally produces higher PR (80-87%) than measured Thai systems. — [ThaiJO IJSIT](https://ph01.tci-thaijo.org/index.php/IJSIT/article/view/268562)
- EPRI used NREL SAM to compute energy and LCOE across DC:AC ratios. — [EPRI 3002014245](https://restservice.epri.com/publicdownload/000000003002014245/0/Product)
- NREL REopt includes battery degradation costs in storage economics/controls. — [OSTI 1984838](https://www.osti.gov/biblio/1984838)
- Solargis P50/P90 methodology combines interannual variability with model and simulation uncertainty (root-sum-square). It recommends ≥10 years of data. — [Solargis](https://solargis.com/blog/best-practices/how-to-calculate-p90-or-other-pxx-pv-energy-yield-estimates); [Solargis KB GHI/DNI uncertainty](https://kb.solargis.com/docs/ghi-and-dni-uncertainty)

### Inferences
- **Minimum inputs a tool run requires:**
  - site lat/long and hourly TMY (GHI, DHI, temperature, wind)
  - array tilt/azimuth/rows, module and inverter datasheets (PAN/OND), DC/AC ratio
  - loss stack: soiling, temperature, mismatch, wiring, availability, degradation
  - 8760 or 15-min load, tariff structure (TOU, demand, ratchet)
  - battery kWh/kW, RTE, SoC limits, degradation model, dispatch rules
  - financial inputs
- Recommended practice for EGAT: run PVsyst (or SAM) for P50 with Thai-calibrated losses (PR target about 78-82%, not 87%). Derive P90 via the Solargis method. Co-simulate PV+BESS in SAM/REopt on the factory's 15-min AMR data. Then compare year-1 output against IEC 61724 monitoring for true-up clauses in the PPA.

### Gaps
- The SAM documentation pages (battery model inputs, degradation models) and the HOMER Grid documentation were not fetched. Exact required-input lists are from general knowledge, not retrieved text.
- No public lender technical due diligence checklist specific to Thai C&I PPAs (e.g., from IFC, ADB, Thai banks) was found. IFC's "Utility-Scale Solar Photovoltaic Power Plants" project developer guide (2015, older) is the commonly cited reference but was not retrieved.
