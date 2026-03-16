export const SOPS = {
  diaper: `
DIAPER LINE — STANDARD OPERATING PROCEDURES

STAGING PROTOCOL:
- All raw material pallets must be staged in designated GX lane positions before shift start.
- Confirm pallet orientation matches AGV pickup alignment (label facing aisle).
- Do not stage partial pallets in primary slots without supervisor authorization.
- Staging positions 1–12 are AGV-priority zones — clear within 90 seconds of drop.

FORKLIFT OPERATION:
- Max travel speed in narrow aisles: 5 mph. Open floor: 8 mph.
- Forks must be fully lowered during all travel — no exceptions.
- Sound horn at all blind corners and cross-aisle intersections.
- No simultaneous operation with AGV in the same aisle segment.

SAFETY:
- PPE required at all times: steel-toed boots, hi-vis vest, hard hat in production zones.
- Any near-miss event must be reported to team lead within 15 minutes.
- Red tag any equipment showing hydraulic leaks, brake issues, or warning lights.
- Do not operate equipment while fatigued — report to team lead for reassignment.

SHIFT HANDOFF:
- Complete scan log before clocking out. Incomplete scans delay next-shift AGV calibration.
- Note any staging anomalies or equipment issues in the shift log terminal.
`,

  charmin: `
CHARMIN — STANDARD OPERATING PROCEDURES

ROLL STOCK HANDLING:
- Charmin roll stock is crush-sensitive — do not stack beyond rated pallet height.
- Use cushion-tip forks when available for all finished goods movement.
- Inspect wrap integrity before moving any pallet — report damage to QC lead.

STAGING PROTOCOL:
- Charmin has dedicated staging lanes C1–C8. Do not use Diaper or Bounty lanes.
- AGV pickup windows: top of every hour and :30. Clear lanes 5 minutes prior.
- Double-stacked pallets require supervisor sign-off before AGV submission.

FORKLIFT OPERATION:
- Charmin floor has elevated pedestrian traffic near Line 3 — reduce speed to 3 mph.
- Do not block emergency exit corridors E1, E2, or E5 for any reason.
- Battery swap must be completed before charge drops below 20%. See charging station map.

SAFETY:
- Line 3 restart alert is audible + strobe — stand clear of conveyor zone during restart.
- Any pallet found outside designated zones must be logged and reported — do not move without authorization.
`,

  bounty: `
BOUNTY — STANDARD OPERATING PROCEDURES

PAPER ROLL HANDLING:
- Bounty rolls are high-volume, time-sensitive — staging delays directly impact line throughput.
- Rolls must be oriented with core facing dock direction for AGV arm engagement.
- Do not mix Bounty SKUs in staging lanes — each SKU has a dedicated slot assignment.

STAGING PROTOCOL:
- Lanes B1–B10 are Bounty-exclusive. Spillover to B11–B14 requires lead authorization.
- AGV network in Bounty zone operates on 20-minute intervals — critical to clear on time.
- Any missed AGV pickup must be logged in the terminal immediately.

FORKLIFT OPERATION:
- Bounty zone has active conveyor crossings at positions X4 and X7 — full stop required.
- Overhead clearance in B-zone is 14 feet — confirm load height before entering.
- Report any AGV path obstructions to the system terminal — do not attempt manual AGV guidance.

SAFETY:
- Bounty zone has compressed air lines overhead — no elevated loads near Line 2 manifold.
- Chemical spill kit located at B-zone entrance. Report any fluid on floor immediately.
`,

  dock: `
DOCK OPERATIONS — STANDARD OPERATING PROCEDURES

INBOUND RECEIVING:
- Verify bill of lading against physical pallet count before driver departure.
- All inbound pallets must be scanned within 30 minutes of dock closure.
- Damaged inbound goods: photograph, tag, and notify receiving supervisor before moving.
- Refrigerated goods have a 15-minute staging window — prioritize cold chain integrity.

OUTBOUND SHIPPING:
- Outbound pallets must be staged in dock door assignment order — do not pre-stage out of sequence.
- Confirm truck seal number matches shipping document before loading begins.
- Load sequence is weight-distributed — heavy pallets to nose, lighter to tail.

FORKLIFT OPERATION:
- Dock levelers must be engaged before any load transfer across the threshold.
- Trailer must be chocked and light signal confirmed green before entry.
- Speed limit on dock apron: 3 mph. No exceptions — pedestrian and truck traffic present.
- Do not leave equipment unattended in dock door positions — clear immediately after load.

SAFETY:
- Dock doors open to weather — hi-vis and awareness of outdoor vehicle traffic required.
- Trailer floor inspection required before entry: check for soft spots, damaged decking.
- Any trailer separation event (trailer moves while being loaded) — stop immediately and alert supervisor.
`,
}
