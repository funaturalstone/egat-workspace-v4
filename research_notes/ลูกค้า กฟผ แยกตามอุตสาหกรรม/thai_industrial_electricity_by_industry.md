# Thailand Industrial (and Large Commercial) Electricity Consumption by Industry: proxy for the Solar PPA, Solar+BESS and BESS addressable market

Primary data: EPPO (สนพ.) Energy Statistics, Section 5.3 "Electricity Consumption" (source tables compiled from MEA, PEA and EGAT). Index page: [EPPO electricity statistics](https://www.eppo.go.th/data-energy-statistic/energy-statistic/electric-energy-stat/%e0%b9%84%e0%b8%9f%e0%b8%9f%e0%b9%89%e0%b8%b2-2/). I downloaded the .xls files and parsed them directly. The files were last saved in Oct 2026 and hold full-year data for 2016–2025 plus Jan–Aug 2026 (8M). Abbreviations: "8M" = Jan–Aug, "7M" = Jan–Jul. All units are GWh. Shares I computed myself are marked "(calc.)".

Caveats that apply throughout:
- **The MEA/PEA/EGAT-direct statistics leave out electricity that factories buy from private SPPs (cogeneration plants in industrial estates) and electricity from self-generation or existing rooftop solar.** The real industrial electricity demand is therefore larger than these figures, and the largest estate-based users (petrochemicals, steel, auto) are under-counted. I found no 2024–2026 source that quantified SPP direct sales to industry, so that number is a gap.
- **The TSIC table does not match the "Industrial" sector total.** EPPO notes that "การใช้ไฟฟ้าราย TSIC ไม่ได้ครอบคลุมผู้ใช้ไฟฟ้าทุกราย" (TSIC-coded consumption does not cover all customers). In 2025 TSIC manufacturing (codes 31–39) totals 66,901 GWh, but the "Industrial" sector in Table 5.3-4 is 86,786 GWh, so TSIC covers about 77% (calc.). The two tables classify customers differently, and EPPO does not publish a reconciliation.
- **EPPO uses old-style 3-digit TSIC codes (ISIC Rev.2-like).** Code 383 is electrical machinery, appliances and electronics. Code 384 is transport equipment, which includes automotive and parts.

---

## Q1. Thailand electricity consumption by sector (latest year)

### Takeaway
Full-year 2025 total consumption was 208,428 GWh. Industrial was 86,786 GWh (41.6%), residential 58,863 GWh (28.2%) and business/commercial 52,811 GWh (25.3%). Industry's share has fallen from 47.5% in 2016 because residential and commercial use grew faster. In 8M 2026 industrial use rose 3.4% year on year, but its share slipped to 40.3%.

### Cited Findings
- Table 5.3-4, whole country (MEA+PEA+Direct Customers) by sector, in GWh — [EPPO T05_03_04.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_04.xls):

| Sector | 2022 | 2023 | 2024 | 2025 | 2025 share | 8M 2026 | 8M 2026 YoY |
|---|---|---|---|---|---|---|---|
| Residential | 53,747 | 57,726 | 62,188 | 58,863 | 28.2% | 43,951 | +9.0% |
| Business (ธุรกิจ) | 46,097 | 49,962 | 54,306 | 52,811 | 25.3% | 37,908 | +7.3% |
| **Industrial (อุตสาหกรรม)** | 88,575 | 86,274 | 88,326 | **86,786** | **41.6%** | 59,856 | +3.4% |
| Government & non-profit | 216 | 222 | 249 | 244 | 0.1% | 170 | +3.5% |
| Agriculture | 335 | 484 | 476 | 420 | 0.2% | 392 | +12.4% |
| Other | 4,219 | 4,826 | 4,263 | 4,456 | 2.1% | 2,787 | −12.2% |
| Free of charge | 4,068 | 4,428 | 4,661 | 4,850 | 2.3% | 3,382 | +6.1% |
| **Grand total** | 197,257 | 203,923 | 214,469 | **208,428** | 100% | 148,447 | +5.7% |

- Industrial growth rates: −2.6% in 2023, +2.4% in 2024 and −1.7% in 2025. Industry's share was 47.5% in 2016, 44.9% in 2022, 41.2% in 2024, 41.6% in 2025 and 40.3% in 8M 2026 — [EPPO T05_03_04.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_04.xls)
- Table remarks: since Oct 2012, government agencies are classified as business or small general service. EV charging stations are not included — [EPPO T05_03_04.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_04.xls)
- EPPO reported that electricity use fell 5.5% YoY in H1 2025, with lower demand from industry and households — [Nation Thailand](https://www.nationthailand.com/business/economy/40055720)
- 2024 consumption had been forecast at 201,913 GWh (+2.4%). The actual 2024 figure in the EPPO table is 214,469 GWh including free-of-charge, or 209,808 GWh excluding it. The forecast may have used a different scope, so use the EPPO table — [Thai PBS World](https://old.thaipbsworld.com/?p=319052)

### Inferences
- Industry is still the largest consuming sector at about 87 TWh/yr from grid utilities alone. It has grown slowly (flat to slightly negative over 2022–2025), so for solar and BESS vendors the opportunity is to displace existing grid kWh, not to serve load growth.
- The fast growth in "Business" (hotels/restaurants +15% in 2024 and +11% in 8M 2026; see Q2) makes large commercial customers a growing second segment for solar PPAs.

### Gaps
- Captive and SPP-supplied industrial electricity is not in these statistics, and I found no 2024–2026 number for it.

---

## Q2. Ranking of industries by electricity consumption (GWh and % share)

### Takeaway
In 2025 the largest grid-electricity users were food & beverages (15.9 TWh, 23.8% of TSIC manufacturing), rubber & plastics (9.4 TWh, 14.0%), electrical/electronics (8.0 TWh, 12.0%), iron & steel (5.9 TWh, 8.9%), non-metallic minerals (4.9 TWh, 7.3%) and transport equipment/automotive (4.8 TWh, 7.2%). Together these six account for about 73% of TSIC manufacturing electricity (calc.). The fastest grower in 8M 2026 was metal products, machinery and electronics (TSIC 38, +10.7% YoY).

### Cited Findings
**TSIC 2-digit, whole country, in GWh** — [EPPO Table 5.3-8, T05_03_08.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_08.xls). The share columns are my calculations; the denominator is the manufacturing TSIC 31–39 total of 66,901 GWh in 2025 and 68,389 GWh in 2024.

| Rank | TSIC 2-digit | 2022 | 2023 | 2024 | 2025 | % of mfg 2025 (calc.) | 8M 2026 YoY |
|---|---|---|---|---|---|---|---|
| 1 | 38 Metal products, machinery & equipment (incl. electrical/electronics, auto) | 17,350 | 16,875 | 17,068 | 17,273 | 25.8% | **+10.7%** |
| 2 | 31 Food, beverages & tobacco | 15,677 | 15,608 | 16,334 | 15,924 | 23.8% | −0.6% |
| 3 | 35 Chemicals, petroleum, coal, rubber & plastics | 12,859 | 12,381 | 12,752 | 12,681 | 19.0% | +1.4% |
| 4 | 37 Basic metals | 7,764 | 7,125 | 7,152 | 6,879 | 10.3% | +4.1% |
| 5 | 36 Non-metallic mineral products | 6,049 | 5,445 | 5,030 | 4,851 | 7.3% | −2.6% |
| 6 | 32 Textiles, apparel, leather | 4,451 | 3,874 | 3,798 | 3,499 | 5.2% | −4.4% |
| 7 | 33 Wood & wood products | 2,357 | 2,447 | 2,474 | 2,348 | 3.5% | −2.9% |
| 8 | 34 Paper & printing | 2,699 | 2,421 | 2,264 | 2,257 | 3.4% | +7.1% |
| 9 | 39 Other manufacturing | 1,126 | 1,267 | 1,518 | 1,188 | 1.8% | +2.5% |
| | **Manufacturing total (calc.)** | 70,330 | 67,443 | 68,389 | **66,901** | 100% | |

**TSIC 3-digit, whole country, 2025 GWh, ranked** — [EPPO Table 5.3-9, T05_03_09.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_09.xls). Shares are my calculations, as a percentage of the 66,901 GWh manufacturing total.

| Rank | TSIC 3-digit | 2024 | 2025 | % of mfg 2025 |
|---|---|---|---|---|
| 1 | 311 Food manufacturing | 9,469 | 9,431 | 14.1% |
| 2 | 383 Electrical machinery, appliances & supplies (electronics/E&E) | 7,843 | 8,017 | 12.0% |
| 3 | 371 Iron & steel basic industries | 6,136 | 5,925 | 8.9% |
| 4 | 312 Food products n.e.c. (e.g., ice, animal feed, sugar/other processed food) | 5,654 | 5,320 | 8.0% |
| 5 | 356 Plastic products n.e.c. | 5,132 | 5,221 | 7.8% |
| 6 | 384 Transport equipment (automotive & parts) | 4,751 | 4,830 | 7.2% |
| 7 | 355 Rubber products | 4,263 | 4,177 | 6.2% |
| 8 | 369 Other non-metallic mineral products (incl. cement/concrete) | 3,665 | 3,519 | 5.3% |
| 9 | 321 Textiles | 3,096 | 2,833 | 4.2% |
| 10 | 381 Fabricated metal products | 2,677 | 2,659 | 4.0% |
| 11 | 331 Sawmills & wood products | 2,227 | 2,081 | 3.1% |
| 12 | 341 Paper & paper products | 1,817 | 1,822 | 2.7% |
| 13 | 351 Industrial chemicals | 1,870 | 1,792 | 2.7% |
| 14 | 390 Other manufacturing | 1,517 | 1,188 | 1.8% |
| 15 | 382 Machinery except electrical | 1,169 | 1,163 | 1.7% |
| 16 | 313 Beverages | 1,164 | 1,125 | 1.7% |
| 17 | 352 Other chemical products | 1,137 | 1,124 | 1.7% |
| 18 | 372 Non-ferrous basic metals | 1,015 | 954 | 1.4% |
| 19 | 362 Glass & glass products | 766 | 737 | 1.1% |
| 20 | 385 Professional/measuring/control equipment | 628 | 603 | 0.9% |
| 21 | 361 Pottery/ceramics | 528 | 501 | 0.7% |
| 22 | 342 Printing & publishing | 446 | 435 | 0.7% |
| — | Others under 0.5% each (322 apparel 323, 332 furniture 267, 323 leather 226, 354 petroleum/coal products 186, 353 refineries 181, 324 footwear 118, 363 fiberglass 95, 314 tobacco 48) | | | |

**Regrouped by the industry labels in the brief (2025, calc. from the TSIC 3-digit table above):**

| Rank | Industry group (TSIC codes) | GWh 2025 | % of mfg |
|---|---|---|---|
| 1 | Food & beverages (311+312+313+314) | 15,924 | 23.8% |
| 2 | Rubber & plastics (355+356) | 9,398 | 14.0% |
| 3 | Electrical appliances & electronics (383) | 8,017 | 12.0% |
| 4 | Iron & steel (371); basic metals overall (371+372) = 6,879 / 10.3% | 5,925 | 8.9% |
| 5 | Non-metallic minerals incl. cement, glass, ceramics (36x) | 4,851 | 7.3% |
| 6 | Automotive & parts / transport equipment (384) | 4,830 | 7.2% |
| 7 | Textiles, apparel, leather, footwear (32x) | 3,499 | 5.2% |
| 8 | Chemicals excl. petroleum (351+352) | 2,917 | 4.4% |
| 9 | Fabricated metal products (381) | 2,659 | 4.0% |
| 10 | Wood & furniture (33x) | 2,348 | 3.5% |
| 11 | Paper & printing (34x) | 2,257 | 3.4% |

- Note on data periods: the TSIC 3-digit file shows a "7 MTHS" year-to-date column, while the 2-digit file shows "8 MTHS", so the YTD columns are not strictly comparable. Food manufacturing (311) was −4.3% YoY in 7M 2026 — [EPPO T05_03_09.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_09.xls)
- For comparison, large non-manufacturing users in 2025 were retail (62) at 11,004 GWh, hotels & restaurants (63) at 12,158 GWh, and transport & storage/warehousing (71) at 3,567 GWh. Hotels & restaurants grew +15.2% in 2024 and +11.4% in 8M 2026 — [EPPO T05_03_08.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_08.xls)
- Historical cross-check: 2012 EPPO data put food at 9,721 GWh and steel & basic metals at 6,954 GWh, which is consistent in order of magnitude — [Thai-German Cooperation / EPPO 2013 presentation](https://www.thai-german-cooperation.info/download/20130917_eedp_4_energy_data_analysis_1.pdf)

### Inferences
- With roughly 16 TWh, food & beverages is the largest single addressable vertical. It is fragmented across many medium-size plants (processing, frozen food, feed, ice, beverages), which suits standardized rooftop solar PPAs.
- Electronics/E&E (383) and auto (384) are concentrated in industrial estates on the Eastern Seaboard. Some of these plants buy from SPPs, so their true demand is likely higher than the EPPO grid figures. TSIC 38's +10.7% in 8M 2026 points to new E&E and electronics capacity coming online.
- Steel (371) and cement/non-metallic (369) are energy-intensive, but their loads are often too large for rooftop solar to cover in any meaningful share. They are more relevant for large BESS, demand-charge management, or off-site and utility-green-tariff deals.

### Gaps
- EPPO does not split TSIC consumption by tariff class (medium vs. large), so I could not determine which industries are mostly "กิจการขนาดกลาง" customers.
- The roughly 23% of industrial-sector consumption not covered by TSIC codes cannot be allocated to industries.
- Captive and SPP electricity by industry is missing. The DEDE Energy Balance (ktoe by manufacturing sub-sector) might cover it, but I did not retrieve it.

---

## Q3. PEA/MEA sales by tariff class: Medium (ประเภท 3) vs Large (ประเภท 4) General Service

### Takeaway
In 2025, Medium General Service (ประเภท 3, 30–999 kW) consumed 33,588 GWh (16.1% of national consumption) and Large General Service (ประเภท 4, at least 1,000 kW or more than 250,000 kWh/month) consumed 76,039 GWh (36.5%). Medium is therefore about 31% of the combined medium+large pool (109.6 TWh) and Large about 69% (calc.). About three quarters of both classes are in PEA areas: 74% of medium kWh and 77% of large kWh.

### Cited Findings
- **Table 5.3-7, whole country by tariff, GWh** — [EPPO T05_03_07.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_07.xls):

| Tariff class | 2022 | 2023 | 2024 | 2025 | 2025 share | 8M 2026 | 8M 2026 YoY |
|---|---|---|---|---|---|---|---|
| Small General Service (ประเภท 2) | 21,606 | 22,781 | 23,960 | 23,236 | 11.1% | 16,612 | +5.9% |
| **Medium General Service (ประเภท 3)** | 30,895 | 32,297 | 34,102 | **33,588** | **16.1%** | 23,622 | +4.7% |
| **Large General Service (ประเภท 4)** | 76,008 | 74,943 | 77,282 | **76,039** | **36.5%** | 52,485 | +3.7% |
| Specific Business (ประเภท 5) | 5,296 | 6,464 | 7,246 | 6,945 | 3.3% | 5,025 | +5.8% |
| Interruptible rate | 1,858 | 1,561 | 1,330 | 1,152 | 0.6% | 724 | −8.1% |
| Stand-by rate | 679 | 389 | 108 | 139 | 0.1% | 115 | +2.1% |
| EGAT Direct Customers | 1,251 | 1,201 | 1,338 | 1,479 | 0.7% | 911 | +0.4% |
| Grand total | 197,257 | 203,923 | 214,469 | 208,428 | 100% | 148,447 | +5.7% |

- **Split by utility in 2025, GWh.** MEA: medium 8,783 (16.2% of MEA sales), large 17,810 (32.8%), MEA total 54,230 — [EPPO T05_03_05.xls (MEA)](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_05.xls). PEA: medium 24,806 (16.2% of PEA sales), large 58,228 (38.1%), PEA total 152,720 — [EPPO T05_03_06.xls (PEA)](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_06.xls). The percentages are my calculations.
  - My calculation of the PEA share of national medium-class kWh is 73.9% (MEA 26.1%). For the large class it is 76.6% (MEA 23.4%).
  - PEA medium-class GWh: 22,449 in 2022, 23,550 in 2023, 25,024 in 2024, 24,806 in 2025. PEA large-class GWh: 58,380 in 2022, 57,201 in 2023, 59,104 in 2024, 58,228 in 2025 — [EPPO T05_03_06.xls](https://www.eppo.go.th/wp-content/uploads/2026/04/T05_03_06.xls)
- **Tariff definitions (MEA; tariffs effective from the Jan 2023 billing month):**
  - Type 3 Medium General Service covers businesses, industry, government and state enterprises with a maximum 15-minute demand of 30–999 kW and an average of no more than 250,000 kWh/month over three consecutive months. Its TOU on-peak window is Mon–Fri 09:00–22:00. TOU demand charges are 74.14 THB/kW at ≥69 kV, 132.93 at 12–24 kV and 210.00 at <12 kV. TOU on-peak energy is 4.10–4.33 THB/kWh and off-peak 2.58–2.64 THB/kWh, before Ft and VAT — [MEA Type 3](https://www.mea.or.th/en/our-services/service-rates/other/-UdKtmgAJkT6C)
  - Type 4 Large General Service applies to demand above 1,000 kW or more than 250,000 kWh/month. Under TOD (4.1), on-peak is every day 18:30–21:30, with demand charges of 224.30, 285.05 and 332.71 THB/kW by voltage. Partial-peak is 08:00–18:30 (29.91–68.22 THB/kW, charged only on demand above the on-peak maximum), and off-peak 21:30–08:00 carries no demand charge. TOU (4.2) uses the same on-peak window and demand charges as Type 3 TOU — [MEA Type 4](https://www.mea.or.th/en/our-services/service-rates/other/-LDELdOY73W3K)

### Inferences
- **The medium-class pool, about 33.6 TWh/yr nationally (2025) with about 24.8 TWh in PEA areas, is the core mid-size factory and large-commercial market.** At very roughly 1,300–1,500 kWh/kWp/yr of Thai rooftop yield, covering 20–30% of that kWh with solar would mean several GW of rooftop capacity. This is an order-of-magnitude illustration, not a sourced estimate, and the yield assumption is not from the sources above.
- Medium-class customers include commercial users (offices, malls, hotels, hospitals) as well as factories. EPPO does not split medium-class kWh by industrial vs business, so "33.6 TWh" overstates the factory-only medium pool.
- Thai retail tariffs follow one national structure, so PEA's Type 3 and Type 4 eligibility thresholds are very likely the same as MEA's. I did not retrieve PEA's own tariff page to confirm this.
- The demand-charge structure drives the BESS case. Type 4 TOD customers pay very high demand charges for the 18:30–21:30 window (up to about 333 THB/kW/month), a window solar cannot cover; a battery can. TOU customers in both classes pay demand charges based on the 09:00–22:00 on-peak maximum, so solar alone only partly reduces those charges. A battery is needed to clip late-afternoon and evening peaks.

### Gaps
- I did not find customer counts (number of accounts) for medium and large classes. PEA and MEA annual reports or the NSO Statistical Yearbook Table 13.3 may have them, but I did not retrieve them.
- I found no PEA or MEA breakdown of medium or large customers by industry.
- PEA's own tariff page was not checked; the definitions above are from MEA.

---

## Q4. Daytime-heavy vs 24-hour/peaky loads by industry (solar vs battery fit)

### Takeaway
I found no published Thai study giving hourly load profiles by industry subsector. Load-shape guidance for Thailand is mostly vendor material and generic. The tariff windows above are the most solid, citable basis for deciding where solar or BESS makes sense.

### Cited Findings
- A Kasetsart University study used load duration curves from annual industrial load data to find peak-clipping and load-factor improvement opportunities, but the abstract does not give profiles by industry — [KU paper](https://esd.kps.ku.ac.th/kuk-gallery/article_5_new/pdf/p_human01.pdf)
- A Thai academic study (TEE journal) tests PV+BESS to cut peak demand by 10% from a 770 kW base, i.e., a medium-to-large factory — [TEE Journal, Techno-Economic Peak Shaving with PV and BESS](https://ph04.tci-thaijo.org/index.php/TEE_J/article/view/11308)
- A Tokyo Gas-linked pilot in Thai factories uses PV directly during the day, charges batteries with surplus, and discharges during evening or peak periods — [ESS News, Jul 2026](https://www.ess-news.com/2026/07/13/tokyo-gas-unit-to-test-bess-pv-model-in-thailand-factories/)
- Vendor estimates, not independent: the demand charge for a 500 kW peak can be about 66,000–110,500 THB/month, and factory peaks may fall in early morning or late afternoon when solar output is low — [CapSolar blog, Apr 2026](https://capsolar-thailand.blogspot.com/2026/04/peak-demand-charges-and-solar-energy.html)
- Tariff timing: Type 4 TOD on-peak is 18:30–21:30 every day, and TOU on-peak is 09:00–22:00 on weekdays — [MEA Type 4](https://www.mea.or.th/en/our-services/service-rates/other/-LDELdOY73W3K)

### Inferences (not from Thai load-profile data; based on general process characteristics; validate with smart-meter data)
- **Likely good solar fit (daytime-heavy or single/double-shift, weekday-weighted):** assembly-type plants such as auto parts assembly, furniture/wood, apparel, fabricated metal, and some electronics assembly lines running 1–2 shifts. Also large commercial users (retail, offices, warehouses with daytime operation). Their kWh falls mostly in the 09:00–22:00 on-peak window, so solar offsets the expensive on-peak kWh.
- **Likely 24-hour, high load factor (solar covers a smaller share; flat load means low curtailment risk, so rooftop PPAs still work but BESS arbitrage is limited):** cold storage and frozen food (311/312), ice plants, plastics injection and extrusion (356), rubber products such as gloves and tyres (355), textile spinning and weaving (321), paper (341), glass (362), cement (369), steel (371), and semiconductor/HDD/PCB electronics (383) with continuous cleanroom HVAC.
- **Likely peaky, where demand-charge or BESS value is highest:** loads with large intermittent motors or furnaces such as electric arc and induction furnaces in steel and foundries (371/381), crushers and mills (369), and plants that ramp at shift start or run late into the evening (18:30–21:30 TOD exposure).

### Gaps
- No Thai, industry-specific 24-hour load-profile dataset was found. Possible sources are PEA/MEA load research, EGAT load research reports, or DEDE designated-factory (โรงงานควบคุม) energy reports; none were retrieved.

---

## Q5. Number of factories by industry/size (DIW, กรมโรงงานอุตสาหกรรม)

### Takeaway
I could not get a recent DIW count of factories by industry and by size (medium). Only aggregate figures turned up: about 71,130 regulated factories nationally (year not stated), and 2025 net openings of +306.

### Cited Findings
- The Ministry of Industry cited about 71,130 factories under its supervision nationwide, without a clear reference year — [Thansettakij](https://www.thansettakij.com/economy/471431) (as summarized in search results; not independently verified)
- In 2025, 1,129 new factories opened (down from 1,444 in 2024) and 823 closed (the same as 2024), a net +306. This is media reporting of DIW data — [The Standard](https://thestandard.co/?p=1209464)
- DIW publishes open datasets of factory counts by area and TSIC ("จำนวนโรงงานในระดับพื้นที่"), with the latest stated data year 2023 (2566), updated Jul 2025 — [data.go.th ops_13_02](https://data.go.th/en/dataset/ops_13_02); [data.go.th ops_13_03 (factory status)](https://gdcc.data.go.th/en/dataset/ops_13_03)

### Inferences
- DIW classifies factories by type (จำพวก 1/2/3) and by horsepower or investment, which does not map directly onto PEA/MEA medium (30–999 kW) vs large (≥1 MW). Any count of "medium factories" would need to be built by joining DIW TSIC counts with a kW-size assumption.

### Gaps
- No DIW breakdown by industry × size for 2024–2026 was retrieved. The DIW open API (openapi.industry.go.th) or the DIW statistics page are the next places to check.
- I found no source linking DIW factory counts to electricity tariff class.
