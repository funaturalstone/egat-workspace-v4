# Thai Tariff, Regulatory and Legal Inputs for EGAT-Owned Behind-the-Meter C&I Solar / Solar+BESS / BESS (research as of 9 Nov 2026)

Scope: mid-size Thai factories (0.2–2 MWp rooftop PV, 0.25–2 MW BESS), EGAT owns the asset and sells energy or savings under a C&I PPA or shared-savings contract at a discount to the PEA/MEA tariff. All tariff values exclude VAT unless stated. "Sat" = satang (0.01 THB).

---

## 1. PEA/MEA tariff structure for medium (Type 3) and large (Type 4) general service

### Takeaway
The base tariff that factories pay has not changed since the May-2023 PEA schedule (the same numbers as the 2015/16 restructuring). For TOU customers, energy costs 4.1839 THB/kWh peak and 2.6037 THB/kWh off-peak at 22–33 kV. The demand charge (132.93 THB/kW at 22–33 kV) applies only to the highest 15-minute demand in the peak window. On top of that sit Ft (16.23 sat/kWh for May–Dec 2026), a fixed 312.24 THB/month service charge, a power-factor charge, a 70% demand "minimum charge" ratchet, and VAT. Type 3 and Type 4 TOU rates are identical. The real difference is that large Type 4 customers may be on TOD, where the demand charge sits in the 18:30–21:30 window and solar cannot reduce it.

### Cited Findings

**Eligibility thresholds**
- Type 3 (กิจการขนาดกลาง) is for a 15-minute maximum demand of 30 kW to <1,000 kW, with average consumption over the previous 3 months not exceeding 250,000 kWh/month. Type 4 (กิจการขนาดใหญ่) is for ≥1,000 kW, or average consumption >250,000 kWh/month. A customer that stays below the threshold for 12 consecutive months is moved down a class. — [PEA Electricity Tariff (bills from May 2023), p.3](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)

**TOU rates: Type 3.2 and Type 4.2 are identical**

| Voltage | Demand charge (THB/kW, peak only) | Peak energy (THB/kWh) | Off-peak energy (THB/kWh) | Service (THB/month) |
|---|---|---|---|---|
| ≥69 kV (3.2.1 / 4.2.1) | 74.14 | 4.1025 | 2.5849 | 312.24 |
| 22–33 kV (3.2.2 / 4.2.2) | 132.93 | 4.1839 | 2.6037 | 312.24 |
| <22 kV (3.2.3 / 4.2.3) | 210.00 | 4.3297 | 2.6369 | 312.24 |

Source: [PEA tariff May 2023, pp.3](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf). A 2026 installer reference confirms these remain PEA's current base rates and that MEA uses the same rates with different voltage bands (12–24 kV and <12 kV). — [Leonics, 28 Sep 2026](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html). An older MEA document also shows the 132.93 (12–24 kV) and 210.00 (<12 kV) demand charges. — [MEA tariff PDF (policy.thinkbluedata mirror)](https://policy.thinkbluedata.com/sites/default/files/MEA%20-%20Electricity%20Tariffs.pdf)

**Normal rate (3.1, flat energy rate plus demand charge on the monthly maximum at any time)**
- 3.1.1 (≥69 kV): 175.70 THB/kW, 3.1097 THB/kWh. 3.1.2 (22–33 kV): 196.26 THB/kW, 3.1471 THB/kWh. 3.1.3 (<22 kV): 221.50 THB/kW, 3.1751 THB/kWh. Service charge 312.24 THB/month. Rate 3.1 is only for customers who were already on it before Nov-2015 billing; once they move to TOU they cannot move back. — [PEA tariff May 2023, p.3](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)

**TOD rate (4.1, large customers only, grandfathered from before Nov 2015)**
- Demand charge (THB/kW) is split into Peak / Partial / Off-peak: 4.1.1 (≥69 kV) 224.30 / 29.91 / 0; 4.1.2 (22–33 kV) 285.05 / 58.88 / 0; 4.1.3 (<22 kV) 332.71 / 68.22 / 0.
- Energy charge: 3.1097 / 3.1471 / 3.1751 THB/kWh, the same at every hour.
- Time windows: Peak 18:30–21:30 every day; Partial 08:00–18:30 every day, where the charge applies only to demand above the Peak-period demand; Off-peak 21:30–08:00. — [PEA tariff May 2023, p.3](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)

**TOU periods**
- Peak: 09:00–22:00, Monday–Friday and Royal Ploughing Day (วันพืชมงคล).
- Off-peak: 22:00–09:00 Monday–Friday, plus all day (00:00–24:00) on Saturday, Sunday, National Labour Day, and normal public holidays. Substitution holidays (วันหยุดชดเชย) are excluded and count as normal weekdays. — [PEA tariff May 2023, p.5](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf); same rule in [Leonics 2026](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html)

**How billing demand is measured**
- Demand is the highest 15-minute average demand (kW) in the month. For TOU, only the demand inside the peak window is billed. — [PEA tariff May 2023, pp.3,5](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)
- A single 15-minute peak in the month sets the demand charge. Solar alone therefore does not reliably reduce it; a battery discharging at peak is needed. At 22–33 kV, a sustained 100 kW reduction saves 13,293 THB/month. — [Leonics 2026](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html)

**Minimum charge (ratchet)**
- For Types 3, 4, 5, 6.2 and 7.2, the monthly bill must not be less than 70% of the highest demand charge in the 12 months ending in the current month. — [PEA tariff May 2023, pp.3–4](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)

**Power factor charge**
- PEA charges this when the month's highest 15-minute lagging kVAR exceeds 61.97% of the highest 15-minute kW demand (roughly PF < 0.85). The excess kVAR is charged at 56.07 THB/kVAR; fractions under 0.5 kVAR are dropped and 0.5 or more rounds up to 1. — [PEA tariff May 2023, p.5](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)

**Transformer-loss uplift**
- Where metering is on the low-voltage side of a customer-owned transformer, metered kW and kWh are increased by 2% to cover transformer losses. — [PEA tariff May 2023, p.3](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)

**Bill composition**
- The bill is base tariff + Ft + VAT, and the published rates exclude VAT. Ft is revised every four months by the ERC (กกพ.). — [PEA tariff May 2023, p.5](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf); [Leonics 2026](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html)

**Current Ft**
- **Sep–Dec 2026: 16.23 sat/kWh.** ERC meeting 29/2569 (no. 1,019) on 22 Jul 2026 set it. The base tariff is 3.78 THB/kWh, giving an average billed tariff of 3.95 THB/kWh excluding VAT. The cost-reflective Ft was 41.27 sat; 16,127.17 MTHB of claw-back (25.04 sat/kWh) was used to bring it down. EGAT is still carrying 31,268 MTHB of accumulated AF on behalf of consumers. — [HoonVision, 23 Jul 2026](https://www.hoonvision.com/?p=211832)
- **May–Aug 2026: 16.23 sat/kWh** (avg 3.95 THB/kWh), set by ERC meeting 13/2569 on 1 Apr 2026 using claw-back. — [PRD](https://www.prd.go.th/th/content/category/detail/id/39/iid/491026), via search summary. Matichon reports a cost-reflective Ft of 29.66 sat, reduced with ~9,472 MTHB of claw-back (13.43 sat). — [Matichon](https://www.matichon.co.th/economy/news_5660017). (29.66 − 13.43 = 16.23, so the two reports agree.)
- **Jan–Apr 2026: average 3.88 THB/kWh.** The formula Ft was estimated at 79.75 sat (up from 64.03 sat cost estimate in Sep–Dec 2025). Options of 4.58 and 3.94 THB/kWh were consulted on. PTT's lower gas-price offer then cut the 3.94 option to 3.88, taking Ft from 15.72 to 9.72 sat. — [PPTV](https://www.pptvhd36.com/wealth/stock-investment/261145); [HoonVision "หั่นค่าไฟเหลือ 3.88"](https://www.hoonvision.com/?p=126770); [ERC Ft Jan–Apr 2026 document](https://www.erc.or.th/web-upload/200xf869baf82be74c18cc110e974eea8d5c/filecenter/admin_ercbat/document-Ft-jan-apr.69__Final.pdf)

**TOU meter fees**
- A PEA announcement in June 2026 set new TOU meter installation fees of 3,300–19,000 THB depending on meter type, applied retroactively from 23 Feb 2026. — [Thansettakij](https://www.thansettakij.com/economy/661503) (via search summary)

**2026 tariff restructuring**
- A 2026 tariff-structure change applied to residential customers only and did not change business rates. — [Khaosod English, 29 Apr 2026](https://www.khaosodenglish.com/news/2026/04/29/thailand-approves-electricity-bill-cuts-boosts-rooftop-solar/) (via search summary; the page returned 403 on direct fetch)

### Inferences
- **Inputs to hard-code per site:** tariff class (3.1 / 3.2 / 4.1 / 4.2), voltage level, utility (PEA or MEA; same rates, different voltage bands), peak energy rate, off-peak energy rate, demand charge, current Ft, service charge (not avoidable), PF threshold and price, 2% loss uplift if LV metering, and the minimum-charge ratchet. A wrong voltage level changes the demand-charge value by 2.8× (74.14 vs 210.00 THB/kW).
- **Base tariff vs Ft:** the base energy rates have been frozen since 2015/16. Nearly all movement in the bill has come through Ft, so the model should escalate Ft separately from the base rate.
- **VAT:** factories are VAT-registered and can usually credit input VAT, so savings should be modelled excluding VAT. VAT matters only for cash-flow timing and for non-VAT-registered customers. (The 7% rate is general knowledge, not verified in this research; see Gaps.)
- **TOD customers:** for a large factory still on 4.1 TOD, the demand charge (285.05 THB/kW at 22–33 kV) is set by demand between 18:30 and 21:30. Solar produces nothing then, so solar-only savings come from energy alone at about 3.15 + Ft THB/kWh, every day of the week. A BESS discharging 18:30–21:30 targets a much larger demand charge than under TOU.
- **The ratchet** means a BESS demand-charge saving is fragile. One month where the battery fails or is depleted resets the 70% floor for the next 12 months. Model the demand saving with a reliability haircut (for example 70–90% of theoretical).

### Gaps
- An official MEA HTML tariff page for 2026 could not be fetched. MEA numbers rely on Leonics plus the older MEA PDF. Confirm on mea.or.th, especially the MEA voltage bands (12–24 kV vs <12 kV) and any MEA-specific holiday list.
- The VAT rate (7%) and the government's extension of the reduced rate beyond 30 Sep 2026 were not verified in this research.
- The official list of TOU off-peak public holidays for 2026–2027 was not retrieved.
- There may be an official PEA tariff document dated after May 2023. None was found, and the 2026 Leonics page says May-2023 rates still apply.

---

## 2. Which rate is the "avoided cost" for solar vs battery, and why the peak rate alone overstates savings

### Takeaway
- **Solar:** the avoided cost is a time-weighted blend. Weekday 09:00–22:00 output avoids peak energy plus Ft; weekend and holiday output avoids only off-peak plus Ft. Exported or curtailed output avoids nothing. Solar avoids almost no TOU demand charge.
- **Battery:** the value is the peak/off-peak spread minus round-trip losses. The real prize is demand-charge reduction, which the ratchet makes fragile.
- **Overstatement:** using the peak rate alone overstates solar savings by roughly 10–15% for a 7-day plant, and by much more when the factory is closed on weekends (output then exported or curtailed).

### Cited Findings
- Solar mainly offsets peak energy, saving the peak rate plus Ft for each kWh used on site. Weekend and holiday output saves only the off-peak rate. — [Leonics 2026](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html)
- Load shifting is worth 1.5802 THB/kWh before losses (peak 4.1839 minus off-peak 2.6037 at 22–33 kV). Savings depend on the site's load curve, and modelling should use a year of 15-minute data. — [Leonics 2026](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html)
- Off-peak applies all day on Saturday, Sunday and normal public holidays, excluding substitution holidays. — [PEA tariff May 2023, p.5](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)
- The TOU demand charge is billed only on peak-window demand, and the 70% minimum-charge ratchet applies. — [PEA tariff May 2023, pp.3,5](https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_MAY_2023.pdf)
- There is no C&I export compensation. The only buy-back scheme identified is residential: 2.20 THB/kWh for 10 years, up to 5 kW per meter, 500 MW nationwide. — [Chambers Renewable Energy 2026 – Thailand](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)

### Inferences

**Worked avoided-cost example (22–33 kV TOU, Ft 16.23 sat)**
- Off-peak days: 104 weekend days plus about 12–16 weekday public holidays, roughly 116–120 days a year (32–33%).
- Solar on a 7-day factory: about 0.67 × (4.1839 + 0.1623) + 0.33 × (2.6037 + 0.1623) ≈ 2.91 + 0.91 ≈ **3.83 THB/kWh**, versus 4.35 THB/kWh if the peak rate is used for every kWh. That is about 12–14% overstated. This is an estimate; the real weighting must come from hourly PV and load profiles, because summer and holiday months differ.
- Factory closed on weekends: weekend PV is exported or curtailed, so its avoided cost is 0 THB/kWh under zero-export. The blended value per kWh *generated* then falls toward roughly 0.67 × 4.35 ≈ 2.9 THB/kWh unless the system is downsized.

**Battery values**
- Arbitrage: about (peak − off-peak) − peak × (1 − RTE). At 22–33 kV with 88% RTE: 4.1839 − 2.6037/0.88 ≈ **1.22 THB per kWh discharged**. Ft cancels out because it applies to both charge and discharge kWh. With 1 cycle per weekday (~245/yr), that is about 300 THB/kWh-capacity/yr. This is weak on its own.
- Demand charge: about 132.93 THB/kW-month × kW shaved × 12 × reliability factor. At 22–33 kV that is up to ~1,595 THB/kW-yr; at <22 kV, 210.00 THB/kW-month gives up to 2,520 THB/kW-yr. This usually dominates the BESS business case.
- Solar + BESS: a battery can absorb weekend or midday surplus PV that would otherwise be curtailed. That adds an avoided-curtailment value (the surplus PV becomes worth the next peak hour's rate × RTE), which is usually the strongest Solar+BESS synergy under a zero-export regime.

**PPA price formula**
- If the PPA is priced as "X% discount to the PEA tariff," the contract must define which tariff applies: the peak rate, the time-weighted rate, or the actual avoided bill. Otherwise EGAT's revenue (from the contract price) and the factory's real saving (the actual avoided cost) diverge, especially on weekends.

**Model input list for avoided cost**
- Hourly or 15-minute load profile for 12 months
- Operating calendar (weekend shifts, annual shutdown)
- Holiday calendar
- PV hourly yield
- Export limit (0 kW)
- BESS power, energy, RTE and dispatch rule
- Demand reliability haircut
- Tariff class and voltage

### Gaps
- There is no official Thai guidance on how to compute "avoided cost" for a C&I PPA. The method above is an inference from the tariff rules.
- No published typical Thai factory load-shape data was found in this research step; see the companion file technical_yield_load_inputs.md.

---

## 3. Tariff escalation outlook (Ft history, policy, PDP 2026) for a 15–25-year model

### Takeaway
- **Policy direction:** Thai policy has held the average tariff around 3.9–4.2 THB/kWh since 2024, using claw-back and EGAT absorbing AF debt.
- **Draft PDP 2026:** its scenarios project an average 2027–2050 tariff of 3.83–3.89 THB/kWh and 4.11–4.58 THB/kWh by 2050. That implies nominal average-tariff growth of only about 0–0.6%/yr from today's 3.95.
- **Modelling implication:** a 2–3%/yr escalator (common in vendor proposals) is not supported. Use 0% (base), −1% (downside) and +1% (upside) sensitivities.
- **Short-term upside risk:** the true cost-reflective Ft (41.27 sat) is 25 sat above the billed Ft. The 31.3 bn THB of EGAT AF still has to be recovered.

### Cited Findings

**Recent Ft decisions**

| Period | Billed Ft (sat/kWh) | Avg tariff (THB/kWh, excl. VAT) | Note | Source |
|---|---|---|---|---|
| May–Aug 2025 | n/a | 4.15 | ERC initially kept Ft unchanged; EGAT's cost-based Ft estimate was 116.37 sat | [Prachachat](https://www.prachachat.net/?p=1770867); [ERC hearing doc May–Aug 2025](https://www.erc.or.th/web-upload/200xf869baf82be74c18cc110e974eea8d5c/202503/m_publichearing/8776/561/file_download/1459dbda25eaccd061e63ff83c1bed37.pdf) |
| Sep–Dec 2025 | (cost estimate 64.03) | see Gaps | | [Dailynews/PPTV summary](https://www.pptvhd36.com/wealth/stock-investment/261145) |
| Jan–Apr 2026 | 9.72 | 3.88 | Formula Ft 79.75 sat; PTT gas price cut | [HoonVision](https://www.hoonvision.com/?p=126770); [PPTV](https://www.pptvhd36.com/wealth/stock-investment/261145) |
| May–Aug 2026 | 16.23 | 3.95 | Cost 29.66 sat, claw-back 13.43 sat; ERC 13/2569, 1 Apr 2026 | [PRD](https://www.prd.go.th/th/content/category/detail/id/39/iid/491026); [Matichon](https://www.matichon.co.th/economy/news_5660017) |
| Sep–Dec 2026 | 16.23 | 3.95 | Cost 41.27 sat, claw-back 25.04 sat; ERC 29/2569, 22 Jul 2026; EGAT AF 31,268 MTHB | [HoonVision](https://www.hoonvision.com/?p=211832) |

- **How often Ft changes:** every four months (Jan–Apr, May–Aug, Sep–Dec). — [Leonics 2026](https://www.leonics.com/2026-09-28-thailand-electricity-tariff-tou-demand-charge-pea-mea.html)
- **Sep–Dec 2026 consultation:** the ERC consulted on 4 options ranging from 3.95 to 4.73 THB/kWh and chose the lowest, using claw-back. — [HoonVision "4 ทางเลือก"](https://www.hoonvision.com/?p=208485)
- **ERC outlook:** the ERC says it will monitor LNG prices, FX and geopolitics, and is studying extra measures following the 15 Jul 2026 NEPC resolution. — [HoonVision, 23 Jul 2026](https://www.hoonvision.com/?p=211832)

**Draft PDP 2026 (EPPO public hearing, 8 Sep 2026; NEPC/Cabinet approval targeted for end-2026)**
- Four scenarios: Base Case (65% clean, avg tariff 2027–2050 of 3.8267 THB/kWh), Net Zero by CCS (3.8859, the highest), Net Zero by RE (89% clean), and Net Zero by RE & CCS.
- End-of-plan (2050) tariffs: 4.11–4.58 THB/kWh.
- Common additions through 2037: 50,900 MW, including 24,300 MW solar and 14,500 MW BESS.
- Grid upgrades of up to 700 bn THB under Net Zero by RE. — [Nation Thailand, 5 Sep 2026](https://www.nationthailand.com/news/40070671)
- Other reports cite the draft as targeting 10,000 MW of rooftop solar, keeping the average tariff ≤3.88 THB/kWh, and a 50–70% clean share. The figures vary by outlet. — [Nation Thailand](https://www.nationthailand.com/news/policy/40070826); [Powerline, 17 Sep 2026](https://powerline.net.in/2026/09/17/thailand-targets-10-gw-of-additional-rooftop-solar-capacity/); [InnovestX](https://www.innovestx.co.th/cafeinvest/en/articles/utilities-20260909-en)
- **Status of the plan:** the draft PDP 2026 was put to public consultation on 8 Sep 2026 and has not been approved yet. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- **Residential buy-back:** the NEPC expanded the residential rooftop buy-back target to 10,000 MW at 2.20 THB/kWh for 20 years. — [Thansettakij](https://www.thansettakij.com/economy/670855) (via search summary). This conflicts with Chambers' "500 MW / 10 years" figure; the 10,000 MW / 20-year figure appears to be a later 2026 expansion.

### Inferences
- **Implied growth rate:** from 3.95 THB/kWh (2026) to 4.11–4.58 THB/kWh (2050) is about **+0.17% to +0.62%/yr nominal** compound. The plan-average tariff (3.83–3.89) is *below* today's level. Recommended model inputs:
  - **Base:** 0%/yr nominal on base + Ft
  - **Low:** −1%/yr, or a one-off −5% step when new cheap solar and BESS enter the system
  - **High:** +1.5%/yr, or a near-term +0.25 THB/kWh step if claw-back money runs out and AF recovery restarts
- **Why escalation matters:** under a discount-to-tariff PPA, EGAT's revenue moves with the tariff. Under a fixed-price PPA, the factory's savings move with the tariff. In both cases, tariff escalation is the largest single swing factor after yield.
- **Short-term Ft risk is upward:** the billed Ft has been cushioned by claw-back (13–25 sat) and EGAT carrying AF debt (31.3 bn THB). A model starting in 2027 should test Ft at 30–45 sat, not only 16 sat.
- **Policy risk:** the government has repeatedly capped tariffs for political reasons. That limits upside for discount-to-tariff contracts and lowers the factory's perceived saving.
- **Possible contract design:** use a PPA floor/ceiling price, or a fixed THB/kWh with an indexation cap, to protect both sides from tariff uncertainty.

### Gaps
- No single official table of Ft and average tariff for every period from 2015 to 2026 was retrieved. Commonly cited values were not verified with a primary source in this research: Ft was negative in many 2015–2021 periods; non-residential average tariffs were about 4.72 THB/kWh (Jan–Apr 2023) and 4.77 (May–Aug 2023); 3.99 (Sep–Dec 2023); 4.18 (2024); 3.98 (May–Aug and Sep–Dec 2025, after government intervention). Pull these from the ERC Ft archive (erc.or.th "การกำหนดค่า Ft ในแต่ละงวด").
- There is a source conflict for May–Aug 2025. Prachachat says the ERC held the average tariff at 4.15 THB/kWh; recollection is that the government later cut it to 3.98. Not verified.
- The Ft for Jan–Apr 2027 had not been decided at the time of research (it is usually announced in Nov/Dec).
- The official EPPO PDP 2026 document was not reviewed directly; tariff numbers come from news coverage.

---

## 4. Regulation: licensing, grid connection, zero export, net billing, private PPA, Direct PPA/TPA, UGT, RECs, carbon

### Takeaway
- **Licensing:** behind-the-meter generation below 1,000 kVA is exempt from the ERC generation licence and needs only a notification. At ≥1,000 kVA, an ERC licence is required under s.47 of the Energy Industry Act. Since 28 Dec 2024, rooftop solar no longer needs a factory licence (รง.4) at any capacity.
- **No export market:** there is no C&I net-billing or export market, so systems must be sized for self-consumption with zero export.
- **Private PPA:** on-site corporate PPAs are used in practice, but there is no explicit statute confirming that a third party may *sell* electricity behind the meter. This is a legal grey area that needs an ERC opinion.
- **Direct PPA/TPA:** the pilot (2,000 MW, data centres) was expanded in principle to industrial users on 15 Jul 2026, but the TPA Code is not yet operational.
- **UGT1 is a cheap competitor:** utility green power costs only +3.75 sat/kWh over the normal tariff. That caps how much a factory will pay for the "green" attribute of on-site solar.

### Cited Findings

**Generation licence**
- Generation requires an ERC licence under s.47 of the Energy Industry Act B.E. 2550 (2007) unless exempt. Generators <1,000 kVA are generally exempt but may still need to notify. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- Rooftop solar <1,000 kVA files an "exempt energy operation" notification (แบบแจ้งการประกอบกิจการพลังงานที่ได้รับการยกเว้นใบอนุญาต) instead of a licence. The article mixes kWp and kVA. — [SCB](https://www.scb.co.th/th/personal-banking/stories/home-car/installing-solar-rooftop-requires-permission.html)
- A 2018 guide says a 2009 decree exempted projects <1,000 kVA from the energy production licence (ERC notification still required), and that a "controlled energy" production licence (DEDE) applies above 200 kVA. — [Watson Farley & Williams Global RE Guide 2018](https://www.wfw.com/wp-content/uploads/2019/11/Global-Renewable-Energy-Guide-2018-Thailand.pdf) (via search summary; may be outdated)

**Factory licence (รง.4)**
- Ministerial Regulation No. 3 B.E. 2567 (2024) means rooftop solar is no longer a "factory" requiring an operating licence, regardless of capacity. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- The change took effect on 28 Dec 2024. Before that, installations above 1,000 kW needed a factory licence. — [Tilleke & Gibbins](https://www.tilleke.com/insights/thailand-removes-factory-license-requirement-for-solar-rooftop-installations) (via search summary)
- Other approvals may still apply: an energy licence or exemption, a controlled-energy licence, and a construction permit. Industrial estate (IEAT) sites need IEAT permits. — [Watson Farley & Williams](https://www.wfw.com/articles/unlocking-solar-potential-thailands-regulatory-shift-on-rooftop-solar-systems/); [Reslink 2026](https://www.reslink.org/blogs/thailand-rooftop-solar-2026/) (via search summary)

**Grid connection**
- Grid-connected systems need interconnection approval from PEA or MEA. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- PEA's governing code is the Power Network System Interconnection Code B.E. 2559 (2016). — [RAST journal 2022](https://ph01.tci-thaijo.org/index.php/RAST/article/view/247343)
- MEA customers must apply for grid connection and pass inspection. — [search summary of MEA rules, Thai PBS/Posttoday](https://www.posttoday.com/smart-city/727932)

**Draft Solar Promotion Act (ร่าง พ.ร.บ.ส่งเสริมการใช้ไฟฟ้าพลังงานแสงอาทิตย์)**
- Cabinet approved it in principle on 29 Jul 2025. Under the draft:
  - Self-use installations would need no permit, only 30 days' notice to the DEDE Director-General.
  - Power could be used only at the installation site.
  - Permitting would have to be completed within 7 days for non-export systems and 30 days for export systems. — [InfoQuest](https://www.infoquest.co.th/?p=516566); [Thai PBS Policy Watch](https://policywatch.thaipbs.or.th/article/economy-245) (via search summary)
- Whether it has been enacted is **unconfirmed**.

**Export compensation**
- There is no C&I export scheme. The only buy-back is residential: 2.20 THB/kWh, 10 years, ≤5 kW per meter, 500 MW nationwide. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- A later report says the residential target was expanded to 10,000 MW for 20 years. — [Thansettakij](https://www.thansettakij.com/economy/670855)

**Private / behind-the-meter PPA**
- Thailand uses an "enhanced single buyer" model, so direct sales between private generators and end users are not generally available. Even so, on-site corporate PPAs, mainly rooftop solar where the customer buys power generated on its own premises, are already used. Chambers gives no definitive legal answer on third-party behind-the-meter sales. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- Tilleke describes private PPAs for solar PV in Thailand as early-stage, with the regulatory framework still developing. — [Tilleke & Gibbins, "Seven Things to Look for in Your Private PPA"](https://www.tilleke.com/insights/seven-things-look-your-private-power-purchase-agreement)
- An ERC source says ESCO-financed rooftop (the investor pays the full installation cost) is driving adoption in retail, logistics and large factories. — [Thansettakij](https://www.thansettakij.com/sustainable/energy/607998) (via search summary)

**Direct PPA / TPA**
- **May 2022:** the ERC issued the TPA Framework Guideline. EGAT, PEA and MEA drafted TPA Service, Connection and Operation Codes. — [Hunton Andrews Kurth, Sep 2024](https://hunton.com/media/legal/200551_Unlocking-Opportunities-Thailands-New-Third-Party-Access-Codes-and-Direct-PPA-Project.pdf)
- **Pilot design:** 2,000 MW, for data centres needing 100% RE, with at least 50 MW each. Fees will include wheeling, connection, system security/ancillary, imbalance and policy charges. ATC is allocated first-come, first-served; the initial model is "one-on-one" (one generator to one load). Service agreements are expected to run 1–5 years with auto-renewal. ESS and microgrids are listed as eligible applicants. — [Hunton, Sep 2024](https://hunton.com/media/legal/200551_Unlocking-Opportunities-Thailands-New-Third-Party-Access-Codes-and-Direct-PPA-Project.pdf)
- **Timeline:**
  - NEPC 1/2567 approved the pilot on 25 Jun 2024. — [InfoQuest "Power of The Act"](https://www.infoquest.co.th/?p=410981)
  - The ERC released draft pilot rules for consultation in Oct 2025. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice); [Hunton](https://www.hunton.com/insights/legal/thailands-draft-regulation-on-direct-power-purchase-agreements-via-third-party-access-for-data-centers)
  - On 15 Jul 2026 the NEPC approved in principle expanding Direct PPA/TPA beyond data centres to other industrial users. The TPA Code is still under development and no generally available TPA regime is operational. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice); [Nation Thailand](https://www.nationthailand.com/news/40070671)
- Ministry of Energy concern that free private green-power trading could shrink EGAT's customer base is reported. — [Bangkok Biznews](https://www.bangkokbiznews.com/business/economic/1119045) (via search summary)

**UGT (Utility Green Tariff)**
- UGT1 is not tied to specific projects; UGT2 lets users pick from a project portfolio. EGAT is the UGT provider. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- 2026 UGT1 = normal tariff + Ft + a **premium of 0.0375 THB/kWh**, excluding VAT (MEA announcement 17/2569). Registration ran 15 Jun–7 Jul 2026, effective from the July-2026 bill. The ERC's Jan-2026 draft uses the same structure (premium = REC price + admin). — [ERC UGT1 2569 hearing doc](https://www.erc.or.th/web-upload/200xf869baf82be74c18cc110e974eea8d5c/202601/m_publichearing/8776/590/file_download/28abb14363b65e110e28fcdce8fd9c83.pdf); [Bangkok Biznews, Jun 2026](https://www.bangkokbiznews.com/business/economic/1050382) (via search summary)
- The final UGT2 tariff had not been confirmed. An April-2026 report expected a management fee of about 5 sat/kWh on top of the green-power procurement cost. — [Thansettakij](https://www.thansettakij.com/sustainable/net-zero/656948) (via search summary)

**RECs and carbon**
- Thailand mainly uses I-REC(E), with **EGAT as the accredited local issuer**. Unbundled RECs trade bilaterally or over the counter, with no official domestic price. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- The Climate Change Act was approved in principle by Cabinet on 2 Dec 2025. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)

**BESS**
- Thailand has no comprehensive BESS framework yet. The ERC is developing one covering legal status, grid connection, and licensing or registration. Grid-connected BESS must meet utility interconnection requirements. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)

### Inferences
- **Inverter sizing vs licensing:** the 1,000 kVA threshold is a sizing input. Keeping inverter AC capacity at ≤999 kVA (for example ~1.2 MWp DC at a 1.2 DC/AC ratio) avoids the ERC generation licence and its time and fees. Projects at 1–2 MWp in this scope will often need a licence, unless split by meter (which needs ERC confirmation). Whether a co-located BESS inverter counts toward the same kVA is unclear; see Gaps.
- **Zero export:** with no C&I export payment and utilities requiring interconnection approval, model exports at 0 THB/kWh. Add the cost of an export-limiting controller or reverse-power relay, and a curtailment loss input (% of PV energy lost).
- **Private PPA legality:** the business model rests on on-site corporate PPA practice, not explicit statute. Before scaling, EGAT should get a written ERC opinion on (a) the licence or exemption for *selling* to a host, and (b) whether EGAT, as a state enterprise, is the right seller.
- **UGT1 as benchmark:** a factory can buy "green" grid power for +3.75 sat/kWh. The factory will not pay a premium for on-site solar; the PPA must be cheaper than the grid tariff. Environmental attributes are worth about 0.04 THB/kWh at most (UGT1 premium as a proxy REC price).
- **I-REC synergy:** EGAT, as issuer, can register BTM systems and either transfer the I-RECs to the factory (as a sales point) or sell them. The REC value is small, ~0.03–0.05 THB/kWh by the UGT premium proxy.
- **Direct PPA and TPA:** a TPA-wheeled Direct PPA is not needed for BTM systems. However, the 15 Jul 2026 expansion to industrial users means factories may soon have an off-site green option, a competitive threat over a 15–25-year contract.

### Gaps
- No official ERC notification text was found confirming that a third party may sell BTM electricity to a host without a distribution or retail licence, or what licence applies to a seller at ≥1,000 kVA. The ERC licensing list (ใบอนุญาตจำหน่ายไฟฟ้า / ใบอนุญาตระบบจำหน่าย) and the Royal Decree on exempted energy operations (พ.ร.ฎ. กำหนดประเภท ขนาด และลักษณะของกิจการพลังงานที่ได้รับยกเว้น) need checking directly.
- The text of PEA/MEA requirements for non-export operation was not found: reverse-power relay settings, connection application fees, inspection fees, study fees and timelines.
- No information was found on whether BESS capacity counts toward the 1,000 kVA threshold, or on BESS-specific connection rules.
- T-VER methodology and price for rooftop solar (TGO) were not researched in depth. No reliable current price was found.
- The final 2026 UGT2 tariff was not found.
- Enactment status of the Solar Promotion Act is unknown.

---

## 5. EGAT's legal mandate to sell directly to factories in PEA/MEA areas

### Takeaway
Under the EGAT Act B.E. 2511 (1968, amended 1992), EGAT may sell electricity to MEA, PEA, other electricity authorities, neighbouring countries, and "other consumers as prescribed by Royal Decree" (EGAT's direct customers). A factory inside a PEA or MEA area is not automatically a permitted EGAT buyer. Selling directly to factories behind the meter would likely need either a Royal Decree listing them, or a subsidiary or affiliate company acting as seller. This needs legal confirmation.

### Cited Findings
- The Act's definitions list the buyers EGAT may sell to: MEA, PEA, other electricity authorities, other consumers prescribed by Royal Decree, and neighbouring countries. — [Asia Pacific Energy policy DB: EGAT Act](https://policy.asiapacificenergy.org/node/4000); [Energy Ministry law PDF](https://law.energy.go.th/web-upload/2xdccaaf3d7f6ae30ba6ae1459eaf3dd66/m_laws/6738/32738/file_download/6ed8764d19f2ee8be4476708cd1feb8b.pdf) (fragmented text, via search summary)
- The Act allows EGAT to sell to MEA and PEA, "a number of direct consumers prescribed by law," and neighbouring countries. — [Tilleke & Gibbins, Electricity Regulation in Thailand overview](https://www.tilleke.com/wp-content/uploads/2019/09/Tilleke-Gibbins-Electricity-regulation-in-Thailand-overview.pdf) (via search summary)
- Section 6 sets out EGAT's objects, including a catch-all for "other activities concerning or continuing the achievement of EGAT's objectives." Section 9 gives EGAT powers within those objects. — [Energy Ministry law PDF](https://law.energy.go.th/web-upload/2xdccaaf3d7f6ae30ba6ae1459eaf3dd66/m_laws/6738/32738/file_download/6ed8764d19f2ee8be4476708cd1feb8b.pdf) (via search summary; exact wording not verified)
- EGAT has a separate tariff for its direct customers (อัตราค่าไฟฟ้าสำหรับลูกค้าตรง, effective 16 Jul 2020). — [EGAT Direct Rate PDF](https://www.egat.co.th/home/wp-content/uploads/2021/07/20200807-Direct-Rate_Nov2018_Additional-16Jul2020.pdf)
- EGAT's current roles:
  - Transmission owner and system operator.
  - Principal buyer of power from IPPs and SPPs.
  - UGT provider and I-REC(E) issuer.
  - Runs a demand-response control centre. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- EGAT's wholesale role is selling high-voltage power to MEA and PEA. — (search summary of [Thansettakij](https://www.thansettakij.com/economy/energy/643699))
- The NEPC approved an EGAT investment budget of 78 bn THB for 2027–2030, mostly for transmission and BESS, not customer-sited installations. — [Thansettakij](https://www.thansettakij.com/economy/670855) (via search summary)

### Inferences
- **Structure risk:** this is a gating legal input, not a number, but it changes the model.
  - If EGAT itself is the seller, the factory may need to be a Royal-Decree-listed direct customer, or the contract must be framed as an equipment lease or energy-service (shared-savings) agreement rather than a "sale of electricity." A lease or ESCO framing may sidestep the sale-of-electricity question; this needs legal advice.
  - If an affiliate is the seller, the NPV should use that company's cost of capital, tax status (a private company pays 20% CIT, while EGAT does not pay CIT the same way; unverified), and BOI eligibility.
- **Channel conflict:** PEA and MEA lose retail revenue when EGAT sells BTM to their customers. That is an inter-state-enterprise policy issue, and Ministry-of-Energy or NEPC endorsement may be needed. The ministry's stated concern about losing grid customers to private green trading supports this. — [Bangkok Biznews](https://www.bangkokbiznews.com/business/economic/1119045)

### Gaps
- The verbatim text of EGAT Act s.6 and the current Royal Decree listing EGAT's direct customers were not obtained.
- No confirmed precedent was found of EGAT, or a named EGAT subsidiary, owning factory rooftop solar or BESS under a PPA. Names to verify with EGAT:
  - "ENZY" (EGAT's energy-solution platform brand)
  - EGAT's energy-solution business unit
  - EGATi (overseas investment)
  - Affiliates EGCO and RATCH, which are listed companies with large EGAT stakes and active in C&I solar
- Whether EGAT pays corporate income tax or makes remittances, and how that affects the NPV tax line, was not researched.

---

## 6. Permits and codes: building permit, factory rules, BESS fire safety, environment

### Takeaway
- **Factory licence:** since 28 Dec 2024, rooftop solar does not need a factory licence. The remaining permits are the ERC licence or notification, PEA/MEA interconnection approval, a building-modification check (อ.1 under the Building Control Act), and IEAT permits inside industrial estates.
- **BESS:** there is no dedicated Thai regulatory framework or confirmed mandatory fire code. Assume international standards (IEC 62619, UL 9540/9540A, NFPA 855) plus any EIT (วสท.) code, and budget for fire suppression and spacing.

### Cited Findings
- **Rooftop solar:** no factory licence is needed. Small systems may be exempt from the energy licence but must notify. PEA/MEA interconnection approval is required, and IEAT sites must meet IEAT requirements. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- **Remaining permits:** a construction permit, controlled-energy licence and energy licence or exemption may still apply after the factory-licence change. — [Watson Farley & Williams](https://www.wfw.com/articles/unlocking-solar-potential-thailands-regulatory-shift-on-rooftop-solar-systems/) (via search summary)
- **Machinery registration:** industrial operators registered 169 rooftop solar systems as machinery (จดทะเบียนกรรมสิทธิ์เครื่องจักร) in 2023, up more than 90% year on year. — [Thansettakij](https://www.thansettakij.com/sustainable/energy/607998) (via search summary). This matters for project financing because a registered machine can be pledged as collateral.
- **BESS framework:** none is comprehensive yet; the ERC is developing one. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)

### Inferences
- **Permitting inputs for the model:**
  - Structural engineer's roof assessment and อ.1 / แจ้ง building modification (cost and time)
  - ERC notification or licence (time, fee)
  - PEA/MEA connection application and study (time, fee)
  - TOU meter fee if the customer changes meter (3,300–19,000 THB)
  - IEAT permit if inside an estate
  - Insurance
  - For BESS: fire risk assessment, suppression system, spacing and possibly a separate container pad
- **Timeline risk:** the draft Solar Act targets 7 days for non-export approval, which suggests current processes take longer. Budget 2–6 months for permits before COD, and include this as a revenue-delay input (no revenue before COD).

### Gaps
- No Thai BESS fire-safety standard (EIT/วสท., DIW or Department of Disaster Prevention) was identified. Thai-language searches returned only Indian CEA rules. Confirm with EIT (วสท.), DIW (กรมโรงงานอุตสาหกรรม) and the local fire authority.
- Not found:
  - Building-permit (อ.1) thresholds for rooftop PV (for example, whether added load per m² triggers a permit)
  - Fees and typical timelines
  - Environmental requirements (EIA is not expected at this scale; unverified)
  - Rules for PV panel or battery waste and end-of-life disposal

---

## 7. Policy incentives: BOI, depreciation, import duty

### Takeaway
BOI A2 incentives (8-year CIT exemption plus import-duty exemption) exist for solar generation. However, BOI Announcement 3/2568 (Apr 2025) reportedly removed eligibility for on-grid solar *without* BESS or energy-saving components, which favours the Solar+BESS product. Whether EGAT or its affiliate can use BOI benefits, and accelerated depreciation and battery import-duty rates, were not confirmed.

### Cited Findings
- **A2 activity:** solar, wind, biomass and biogas generation (excluding waste) is BOI A2. Eligible projects may get an 8-year CIT exemption, subject to a cap, plus import duty exemptions. BOI-promoted projects may also get land-ownership rights under s.27 of the Investment Promotion Act. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- **Announcement 3/2568 (Apr 2025):** on-grid solar projects without BESS or energy-saving upgrades are no longer eligible for BOI incentives. — [Energreen (secondary source)](https://energreenasia.com/energreen-powering-thailands-sustainable-future-with-solar-ess-ev-charging/); verify against the BOI announcement text.
- **Other BOI categories:** BOI created a category for repairing and reusing used EV batteries that includes energy storage systems. It also announced new incentives for battery-material production for EVs and ESS on 17 Oct 2025. — [Batteries News](https://batteriesnews.com/thailand-boi-approves-investment-worth-usd-154-billion-in-biochemicals-data-centers-sets-new-promotion-category-for-the-repair-of-used-ev-batteries-and-ess/); [Energy-Storage.news](https://www.energy-storage.news/thailands-energy-storage-market-lags-despite-renewable-push-and-upstream-manufacturing-support/)
- **Foreign Business Act:** the DBD has taken the view that generating and selling electricity is not a business listed in the Act's schedules. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)
- **Residential solar tax incentive:** Royal Decree No. 805 B.E. 2569 (2026) gives up to 200,000 THB. It does not apply to C&I. — [Chambers 2026](https://chambers.com/practice-guides/guides/renewable-energy-2026/thailand/law-and-practice)

### Inferences
- **BOI changes the IRR materially:** the CIT exemption only helps an entity that pays CIT. If EGAT itself owns the assets, the BOI CIT benefit may be irrelevant; if a taxable subsidiary owns them, it can be large. The model should carry a "tax status" switch.
- **Product mix:** if Announcement 3/2568 applies as reported, Solar-only projects lose BOI eligibility while Solar+BESS keeps it. That is an extra reason for the Solar+BESS product.
- **Import duty:** the BOI import-duty exemption on batteries and inverters could lower BESS capex. The size depends on the normal duty rate, which was not found.

### Gaps
- Not found:
  - Text of BOI Announcement 3/2568 and its category code (for example 7.1.1.x), conditions and caps
  - Whether a state enterprise (EGAT) or a state-enterprise subsidiary may receive BOI promotion
  - Thai Revenue Department depreciation rules for solar and BESS (standard rates, any accelerated or 1.5×–2× deduction schemes in 2025–2026)
  - Normal import duty and excise on lithium-ion stationary batteries (HS 8507.60) and on inverters
  - Whether ASEAN-China FTA zero-duty applies
- These need BOI, Revenue Department and Customs sources, or a Thai tax adviser.
