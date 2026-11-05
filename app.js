
const DECK_URL='./deck.json',EXAM_URL='./exam_questions.json',EXAM_SUPPLEMENT_URL='./paper_supplement_2016_2017.json',EXAM_CORRECTIONS_URL='./exam_answer_corrections.json',DAY=86400000;
const EXTRA_PRACTICE_URLS=['./gap_questions_physics_v48.json','./gap_questions_chemistry_v48.json','./gap_questions_maths_v48.json','./gap_questions_extended_v49.json','./mechanics_focus_v39.json','./mechanics_graphs_v118.json','./atomic_structure_focus_v43.json','./amount_of_substance_focus_v44.json','./bonding_focus_v49.json','./bonding_weakness_focus_v52.json','./energetics_focus_v50.json','./energetics_worked_followups_v51.json','./energetics_weakness_focus_v53.json','./maths_pure_proof_vectors_v190.json','./maths_as_pure_gap_challenges_v191.json','./science_practical_data_v194.json','./science_mock_application_v195.json','./science_mock_evidence_v196.json','./physics_mechanics_reasoning_v197.json','./science_waves_energetics_v198.json','./chemistry_mock_precision_v199.json','./physics_measurements_particles_v200.json','./chemistry_rp4_rp6_evidence_v202.json','./physics_graphs_circuits_v203.json','./maths_pure_proof_vector_applications_v209.json','./chemistry_rates_rp7_kp_v210.json','./physics_fibre_signal_application_v225.json','./physics_waves_interference_application_v226.json','./physics_particle_exchange_diagram_practice_v265.json','./chemistry_organic_drawing_practice_v267.json','./physics_uncertainty_graph_practice_v268.json','./physics_nuclear_conservation_practice_v269.json','./chemistry_amount_applied_practice_v270.json','./maths_year1_pure_reasoning_v271.json','./maths_as_graph_transform_sketches_v272.json','./maths_year1_circle_vector_gaps_v273.json','./chemistry_as_inorganic_tests_practice_v274.json','./physics_refraction_fibres_practice_v275.json','./chemistry_as_bonding_shapes_practice_v276.json','./chemistry_as_bonding_structures_practice_v277.json','./chemistry_amount_precision_applications_v278.json','./physics_waves_polarisation_stationary_practice_v279.json','./physics_mechanics_signed_area_couples_practice_v280.json','./maths_year1_trigonometry_differentiation_practice_v292.json','./science_practical_diagram_applications_v313.json','./science_application_gaps_v333.json','./maths_inequality_sign_reasoning_v335.json','./chemistry_atom_economy_sustainability_practice_v338.json','./maths_year1_pure_targeted_practice_v340.json','./physics_particles_three_application_gaps_v342.json'];
const EXTRA_FLASHCARD_URLS=['./maths_mock_recall_v186.json','./maths_mock_recall_v187.json','./chemistry_mock_recall_v189.json','./maths_mock_recall_v192.json','./physics_mock_recall_v193.json','./chemistry_mock_recall_v193.json','./physics_mock_recall_v195.json','./chemistry_mock_recall_v195.json','./physics_mock_recall_v196.json','./chemistry_mock_recall_v196.json','./chemistry_mock_recall_v199.json','./chemistry_rates_rp7_recall_v210.json','./chemistry_rp4_recall_v215.json','./chemistry_as_measurement_recall_v218.json','./chemistry_tof_precision_recall_v219.json','./chemistry_ion_tests_recall_v220.json','./chemistry_practicals_analysis_recall_v221.json','./chemistry_rp5_rp6_reasoning_recall_v222.json','./physics_optical_fibre_precision_recall_v225.json','./physics_waves_reasoning_recall_v226.json','./physics_cross_spec_recall_v227.json','./chemistry_cross_spec_recall_v227.json','./maths_as_pure_cross_spec_recall_v227.json','./physics_waves_crosswalk_recall_v229.json','./physics_mechanics_cross_spec_recall_v230.json','./physics_electricity_cross_spec_recall_v231.json','./maths_first_mock_pure_precision_v232.json','./chemistry_bonding_diagram_recall_v237.json','./chemistry_atomic_tof_applications_v238.json','./chemistry_amount_applications_v239.json','./physics_particles_applications_v243.json','./maths_first_mock_pure_applied_v245.json','./maths_first_mock_circle_geometry_v246.json','./chemistry_energetics_applications_v247.json','./physics_measurements_applications_v248.json','./chemistry_rates_kp_applications_v249.json','./physics_electricity_applications_v250.json','./maths_first_mock_pure_challenges_v252.json','./physics_waves_applications_v253.json','./chemistry_atomic_tof_applications_v254.json','./chemistry_thermodynamics_applications_v256.json','./physics_mechanics_applications_v257.json','./maths_year1_pure_breadth_v260.json','./physics_uncertainty_graph_recall_v268.json','./physics_nuclear_conservation_recall_v269.json','./maths_as_graph_transform_recall_v272.json','./chemistry_as_inorganic_tests_recall_v274.json','./physics_refraction_fibres_recall_v275.json','./chemistry_as_bonding_shapes_recall_v276.json','./chemistry_as_bonding_structures_recall_v277.json','./chemistry_amount_sigfig_formula_recall_v278.json','./physics_waves_polarisation_stationary_recall_v279.json','./physics_mechanics_signed_area_couples_recall_v280.json','./mock_short_varied_recall_v293.json','./mock_short_recall_and_cloze_v298.json','./science_partial_skill_short_recall_v312.json'];
// v287: exact-ID AQA AS subsection metadata for individually reviewed legacy cards.
// Never alter question wording, marking rules, mock flags, or any progress IDs.
const V287_LEGACY_SPEC_GROUPS=Object.freeze([
 {
  "subject": "Physics",
  "topic": "Motion graphs",
  "stage": "AS",
  "specRef": "3.4.1.3",
  "ids": [
   "phy_motion_d",
   "phy_motion_v",
   "phy_motion_a",
   "v33_card_physics_motion_graphs_11",
   "v33_card_physics_motion_graphs_12",
   "v33_card_physics_motion_graphs_13",
   "phy_graph_weakness_v36_s_negative",
   "phy_graph_weakness_v36_s_horizontal_vs_v_horizontal",
   "phy_graph_weakness_v36_s_tangent_numeric",
   "phy_graph_weakness_v36_v_gradient_numeric",
   "phy_graph_weakness_v36_v_trapezium_numeric",
   "phy_graph_weakness_v36_v_signed_vs_distance",
   "phy_graph_weakness_v36_v_zero_crossing",
   "phy_graph_weakness_v36_v_negative_acceleration",
   "phy_graph_weakness_v36_a_area_numeric",
   "phy_graph_weakness_v36_a_negative_area",
   "phy_graph_weakness_v36_v_multistage_area",
   "phy_graph_weakness_v36_compare_slope_vs_area",
   "phy_graph_weakness_v36_axis_unit_check",
   "phy_mechanics_focus_v37_01",
   "phy_mechanics_focus_v37_02",
   "phy_mechanics_focus_v37_03",
   "phy_mechanics_focus_v37_04",
   "phy_mechanics_focus_v37_05",
   "phy_mechanics_focus_v37_06",
   "phy_mechanics_focus_v37_07",
   "phy_mechanics_focus_v37_08",
   "phy_focus_v39_07",
   "phy_graph_v118_01",
   "phy_graph_v118_02",
   "phy_graph_v118_03",
   "phy_graph_v118_04",
   "phy_graph_v118_05",
   "phy_graph_v118_06",
   "phy_graph_v118_07",
   "phy_graph_v118_08"
  ]
 },
 {
  "subject": "Physics",
  "topic": "Photoelectric effect",
  "stage": "AS",
  "specRef": "3.2.2.1",
  "ids": [
   "phy_photoelectric_001",
   "phy_photoelectric_002",
   "v33_card_physics_photoelectric_effect_19",
   "v33_card_physics_photoelectric_effect_20",
   "phy_pandr_v29_work_function",
   "phy_pandr_v29_threshold_frequency",
   "phy_pandr_v29_photo_eq",
   "phy_pandr_v29_threshold_eq",
   "phy_pandr_v29_intensity_fixed_f",
   "phy_pandr_v29_frequency_fixed_i",
   "phy_pandr_v29_instant_emission",
   "phy_pandr_v29_stopping_eq",
   "phy_pandr_v29_kef_gradient",
   "phy_pandr_v29_stopping_gradient",
   "phy_pandr_v29_threshold_wavelength",
   "phy_spectra_photo_v32_classical_failure",
   "phy_spectra_photo_v32_ke_range",
   "phy_spectra_photo_v32_intensity_stopping",
   "phy_spectra_photo_v32_below_threshold_graph",
   "phy_spectra_photo_v32_max_speed"
  ]
 },
 {
  "subject": "Chemistry",
  "topic": "Mass spectrometry",
  "stage": "AS",
  "specRef": "3.1.1.2",
  "ids": [
   "chem_atomic_v43_13",
   "chem_atomic_v43_14",
   "chem_atomic_v43_15",
   "chem_atomic_v43_16",
   "chem_atomic_v43_17",
   "chem_atomic_v43_18",
   "chem_atomic_v43_19",
   "chem_atomic_v43_20",
   "chem_atomic_v43_21",
   "chem_atomic_v43_22",
   "chem_atomic_v43_23",
   "chem_atomic_v43_24",
   "chem_atomic_v43_25",
   "chem_atomic_v43_26",
   "chem_atomic_v43_27",
   "chem_atomic_v43_28",
   "chem_atomic_v43_29",
   "chem_atomic_v43_30",
   "chem_atomic_v43_31",
   "chem_atomic_v43_32",
   "chem_atomic_v43_33",
   "chem_atomic_v43_34",
   "chem_atomic_v43_35",
   "chem_atomic_v43_36",
   "chem_atomic_v43_37",
   "chem_atomic_v43_38"
  ]
 },
 {
  "subject": "Chemistry",
  "topic": "Ionisation energy",
  "stage": "AS",
  "specRef": "3.1.1.3",
  "ids": [
   "chem_ionisation_def",
   "chem_ie_trend",
   "chem_atomic_v43_39",
   "chem_atomic_v43_40",
   "chem_atomic_v43_41",
   "chem_atomic_v43_42",
   "chem_atomic_v43_43",
   "chem_atomic_v43_44",
   "chem_atomic_v43_45",
   "chem_atomic_v43_46",
   "chem_atomic_v43_47",
   "chem_atomic_v43_48",
   "chem_atomic_v43_49",
   "chem_atomic_v43_50",
   "chem_atomic_v43_51",
   "chem_config_weak_v45_01",
   "chem_config_weak_v45_02",
   "chem_config_weak_v45_03",
   "chem_config_weak_v45_04",
   "chem_config_weak_v45_05",
   "chem_config_weak_v45_06",
   "chem_config_weak_v45_07",
   "chem_config_weak_v45_08",
   "chem_config_weak_v45_09",
   "chem_config_weak_v45_10",
   "chem_ie_focus_v46_01",
   "chem_ie_focus_v46_02",
   "chem_ie_focus_v46_03"
  ]
 }
]);
function applyV287LegacySpecRefs(existing){
 const byId=new Map();
 for(const group of V287_LEGACY_SPEC_GROUPS)for(const id of group.ids)
  byId.set(id,group);
 for(const card of existing){
  const group=byId.get(card.id);
  if(group&&card.subject===group.subject&&card.topic===group.topic&&
     card.stage===group.stage&&!String(card.specRef||'').trim())
   card.specRef=group.specRef;
 }
 return existing;
}

// v288: reviewed AS Chemistry Bonding core cards get precise AQA subsection tags.
// Exact ID, topic and stage guard; never overwrite existing specRef or original card data.
const V288_LEGACY_CHEM_BONDING_GROUPS=Object.freeze([
 {
  "subject": "Chemistry",
  "topic": "Shapes",
  "stage": "AS",
  "specRef": "3.1.3.5",
  "ids": [
   "chem_shape_linear",
   "chem_shape_trig",
   "chem_shape_tetra",
   "chem_lone_pair",
   "chem_bonding_v48_01",
   "chem_bonding_v48_02",
   "chem_bonding_v48_03",
   "chem_bonding_v48_04",
   "chem_bonding_v48_05",
   "chem_bonding_v48_06",
   "chem_bonding_v48_07",
   "chem_bonding_v48_08",
   "chem_bonding_v48_09",
   "chem_bonding_v48_10",
   "chem_bonding_v48_11",
   "chem_bonding_v48_12",
   "chem_bonding_v48_13",
   "chem_bonding_v48_14",
   "chem_bonding_v48_15",
   "chem_bonding_v48_16",
   "chem_bonding_v48_17",
   "chem_bonding_v48_18",
   "chem_bonding_v48_19",
   "chem_bonding_v48_20",
   "chem_bonding_v48_21",
   "chem_bonding_v48_22",
   "chem_bonding_v52_10",
   "chem_bonding_v52_11",
   "chem_bonding_v52_12",
   "chem_bonding_v52_13",
   "chem_bonding_v52_14",
   "chem_bonding_v52_15",
   "chem_bonding_v52_16",
   "chem_bonding_v52_17",
   "chem_bonding_v52_18",
   "chem_bonding_v52_19",
   "chem_bonding_v52_20",
   "chem_bonding_v52_21",
   "chem_bonding_v52_22",
   "chem_bonding_v52_23",
   "chem_bonding_v52_24",
   "chem_bonding_v52_25",
   "chem_bonding_v52_26",
   "chem_bonding_v52_47"
  ]
 },
 {
  "subject": "Chemistry",
  "topic": "Intermolecular forces",
  "stage": "AS",
  "specRef": "3.1.3.7",
  "ids": [
   "chem_hbond",
   "v33_card_chemistry_intermolecular_forces_43",
   "chem_bonding_v48_31",
   "chem_bonding_v48_32",
   "chem_bonding_v48_33",
   "chem_bonding_v48_34",
   "chem_bonding_v48_35",
   "chem_bonding_v48_36",
   "chem_bonding_v48_37",
   "chem_bonding_v48_38",
   "chem_bonding_v48_39",
   "chem_bonding_v48_40",
   "chem_bonding_v48_41",
   "chem_bonding_v48_42",
   "chem_bonding_v48_43",
   "chem_bonding_v48_44",
   "chem_bonding_v48_45",
   "chem_bonding_v48_46",
   "chem_bonding_v48_47",
   "chem_bonding_v52_35",
   "chem_bonding_v52_36",
   "chem_bonding_v52_37",
   "chem_bonding_v52_38",
   "chem_bonding_v52_39",
   "chem_bonding_v52_40",
   "chem_bonding_v52_41",
   "chem_bonding_v52_42",
   "chem_bonding_v52_43",
   "chem_bonding_v52_45",
   "chem_bonding_v52_48"
  ]
 },
 {
  "subject": "Chemistry",
  "topic": "Crystal structures",
  "stage": "AS",
  "specRef": "3.1.3.4",
  "ids": [
   "chem_bonding_v47_21",
   "chem_bonding_v47_22",
   "chem_bonding_v47_23",
   "chem_bonding_v47_24",
   "chem_bonding_v47_25",
   "chem_bonding_v47_26",
   "chem_bonding_v47_27",
   "chem_bonding_v47_28",
   "chem_bonding_v47_29",
   "chem_bonding_v47_30",
   "chem_bonding_v47_31",
   "chem_bonding_v47_32",
   "chem_bonding_v47_33",
   "chem_bonding_v47_34",
   "chem_bonding_v47_35",
   "chem_bonding_v47_36",
   "chem_bonding_v47_37",
   "chem_bonding_v47_38",
   "chem_bonding_v47_39",
   "chem_bonding_v47_40",
   "chem_bonding_v47_41",
   "chem_bonding_v47_42"
  ]
 },
 {
  "subject": "Chemistry",
  "topic": "Bond polarity",
  "stage": "AS",
  "specRef": "3.1.3.6",
  "ids": [
   "chem_bonding_v48_23",
   "chem_bonding_v48_24",
   "chem_bonding_v48_25",
   "chem_bonding_v48_26",
   "chem_bonding_v48_27",
   "chem_bonding_v48_28",
   "chem_bonding_v48_29",
   "chem_bonding_v48_30",
   "chem_bonding_v52_27",
   "chem_bonding_v52_28",
   "chem_bonding_v52_29",
   "chem_bonding_v52_30",
   "chem_bonding_v52_31",
   "chem_bonding_v52_32",
   "chem_bonding_v52_33",
   "chem_bonding_v52_34",
   "chem_bonding_v52_46"
  ]
 }
]);
function applyV288LegacyChemBondingSpecRefs(existing){
 const byId=new Map();
 for(const group of V288_LEGACY_CHEM_BONDING_GROUPS)for(const id of group.ids)
  byId.set(id,group);
 for(const card of existing){
  const group=byId.get(card.id);
  if(group&&card.subject===group.subject&&card.topic===group.topic&&
     card.stage===group.stage&&!String(card.specRef||'').trim())
   card.specRef=group.specRef;
 }
 return existing;
}

// v289: AQA 3.1.4 Energetics source subsection mapping for individually reviewed cards.
// Exact ID, stage, topic and subject match only; never overwrite existing specRef.
const V289_LEGACY_ENERGETICS_GROUPS=Object.freeze([
 {
  "subject": "Chemistry",
  "stage": "AS",
  "topic": "Energetics",
  "specRef": "3.1.4.1",
  "ids": [
   "chem_enthalpy_def",
   "chem_energetics_v49_01",
   "chem_energetics_v49_02",
   "chem_energetics_v49_03",
   "chem_energetics_v49_04",
   "chem_energetics_v49_05",
   "chem_energetics_v49_08",
   "chem_energetics_v49_09",
   "chem_energetics_v49_10",
   "chem_energetics_v49_11",
   "chem_energetics_v49_12",
   "chem_energetics_v49_13",
   "chem_energetics_v49_14",
   "chem_energetics_v49_15",
   "chem_energetics_v49_16",
   "chem_energetics_v49_17",
   "chem_energetics_v53_01",
   "chem_energetics_v53_02",
   "chem_energetics_v53_03",
   "chem_energetics_v53_04",
   "chem_energetics_v53_05",
   "chem_energetics_v53_06",
   "chem_energetics_v51_04"
  ]
 },
 {
  "subject": "Chemistry",
  "stage": "AS",
  "topic": "Energetics",
  "specRef": "3.1.4.3",
  "ids": [
   "chem_hess",
   "chem_energetics_v49_18",
   "chem_energetics_v49_19",
   "chem_energetics_v53_07"
  ]
 },
 {
  "subject": "Chemistry",
  "stage": "AS",
  "topic": "Energetics",
  "specRef": "3.1.4.4",
  "ids": [
   "chem_bondenthalpy",
   "v33_card_chemistry_energetics_45"
  ]
 },
 {
  "subject": "Chemistry",
  "stage": "AS",
  "topic": "Calorimetry",
  "specRef": "3.1.4.2",
  "ids": [
   "chem_energetics_v49_20",
   "chem_energetics_v49_21",
   "chem_energetics_v49_22",
   "chem_energetics_v49_23",
   "chem_energetics_v49_24",
   "chem_energetics_v49_25",
   "chem_energetics_v49_26",
   "chem_energetics_v49_27",
   "chem_energetics_v49_28",
   "chem_energetics_v49_29",
   "chem_energetics_v49_30",
   "chem_energetics_v49_31",
   "chem_energetics_v49_32",
   "chem_energetics_v49_33",
   "chem_energetics_v49_34",
   "chem_energetics_v49_35",
   "chem_energetics_v49_36",
   "chem_energetics_v49_37",
   "chem_energetics_v53_08",
   "chem_energetics_v53_09",
   "chem_energetics_v53_10",
   "chem_energetics_v53_11",
   "chem_energetics_v53_12",
   "chem_energetics_v53_13",
   "chem_energetics_v53_14",
   "chem_energetics_v53_15",
   "chem_energetics_v53_16"
  ]
 },
 {
  "subject": "Chemistry",
  "stage": "AS",
  "topic": "RP2 Enthalpy",
  "specRef": "3.1.4.2",
  "ids": [
   "chem_rp2",
   "chem_energetics_v49_60",
   "chem_energetics_v49_61",
   "chem_energetics_v49_62",
   "chem_energetics_v49_63",
   "chem_energetics_v49_64",
   "chem_energetics_v51_01",
   "chem_energetics_v51_02",
   "chem_energetics_v51_03",
   "chem_energetics_v53_29",
   "chem_energetics_v53_30",
   "chem_energetics_v53_31",
   "chem_energetics_v53_32",
   "chem_energetics_v53_33",
   "chem_energetics_v53_34",
   "chem_energetics_v53_35",
   "chem_energetics_v53_36"
  ]
 },
 {
  "subject": "Chemistry",
  "stage": "AS",
  "topic": "Hess's law",
  "specRef": "3.1.4.3",
  "ids": [
   "chem_energetics_v49_38",
   "chem_energetics_v49_39",
   "chem_energetics_v49_40",
   "chem_energetics_v49_41",
   "chem_energetics_v49_42",
   "chem_energetics_v49_43",
   "chem_energetics_v49_44",
   "chem_energetics_v49_45",
   "chem_energetics_v49_46",
   "chem_energetics_v49_47",
   "chem_energetics_v49_48",
   "chem_energetics_v49_49",
   "chem_energetics_v53_17",
   "chem_energetics_v53_18",
   "chem_energetics_v53_19",
   "chem_energetics_v53_20",
   "chem_energetics_v53_21",
   "chem_energetics_v53_22",
   "chem_energetics_v53_23",
   "chem_energetics_v53_24",
   "chem_energetics_v53_25"
  ]
 },
 {
  "subject": "Chemistry",
  "stage": "AS",
  "topic": "RP2 Enthalpy",
  "specRef": "3.1.4.3",
  "ids": [
   "chem_energetics_v49_65"
  ]
 },
 {
  "subject": "Chemistry",
  "stage": "AS",
  "topic": "Bond enthalpies",
  "specRef": "3.1.4.4",
  "ids": [
   "chem_energetics_v49_50",
   "chem_energetics_v49_51",
   "chem_energetics_v49_52",
   "chem_energetics_v49_53",
   "chem_energetics_v49_54",
   "chem_energetics_v49_55",
   "chem_energetics_v49_56",
   "chem_energetics_v49_57",
   "chem_energetics_v49_58",
   "chem_energetics_v49_59",
   "chem_energetics_v51_05",
   "chem_energetics_v53_26",
   "chem_energetics_v53_27",
   "chem_energetics_v53_28"
  ]
 }
]);
function applyV289LegacyEnergeticsSpecRefs(existing){
 const byId=new Map();
 for(const group of V289_LEGACY_ENERGETICS_GROUPS)for(const id of group.ids)byId.set(id,group);
 for(const card of existing){
  const group=byId.get(card.id);
  if(group&&card.subject===group.subject&&card.topic===group.topic&&
     card.stage===group.stage&&!String(card.specRef||'').trim())
   card.specRef=group.specRef;
 }
 return existing;
}

// v290: individually approved AQA AS Physics Electricity 3.5.1 metadata.
// No wildcard by topic: exact ID, subject, stage and topic must all match.
const V290_LEGACY_ELECTRICITY_GROUPS=Object.freeze([
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.1",
  "ids": [
   "phy_current"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.1",
  "ids": [
   "phy_pd"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.1",
  "ids": [
   "phy_resistance"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.1",
  "ids": [
   "phy_power_elec"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "I–V characteristics",
  "specRef": "3.5.1.2",
  "ids": [
   "phy_filament_iv"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "I–V characteristics",
  "specRef": "3.5.1.2",
  "ids": [
   "phy_diode"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "I–V characteristics",
  "specRef": "3.5.1.2",
  "ids": [
   "v33_card_physics_i_v_characteristics_10"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.3",
  "ids": [
   "phy_resistivity"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Sensors",
  "specRef": "3.5.1.3",
  "ids": [
   "phy_thermistor"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "RP5 Resistivity",
  "specRef": "3.5.1.3",
  "ids": [
   "phy_rp5"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.4",
  "ids": [
   "phy_series_current"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.4",
  "ids": [
   "phy_series_pd"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.4",
  "ids": [
   "phy_parallel_pd"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.4",
  "ids": [
   "phy_parallel_current"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Potential dividers",
  "specRef": "3.5.1.5",
  "ids": [
   "phy_potential_divider"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Sensors",
  "specRef": "3.5.1.5",
  "ids": [
   "phy_ldr"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Electricity",
  "specRef": "3.5.1.6",
  "ids": [
   "phy_emf"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Internal resistance",
  "specRef": "3.5.1.6",
  "ids": [
   "phy_internal_001"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Internal resistance",
  "specRef": "3.5.1.6",
  "ids": [
   "v33_card_physics_internal_resistance_8"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "Internal resistance",
  "specRef": "3.5.1.6",
  "ids": [
   "v33_card_physics_internal_resistance_9"
  ]
 },
 {
  "subject": "Physics",
  "stage": "AS",
  "topic": "RP6 EMF/internal resistance",
  "specRef": "3.5.1.6",
  "ids": [
   "phy_rp6"
  ]
 }
]);
function applyV290LegacyElectricitySpecRefs(existing){
 const byId=new Map();
 for(const group of V290_LEGACY_ELECTRICITY_GROUPS)for(const id of group.ids)byId.set(id,group);
 for(const card of existing){
  const group=byId.get(card.id);
  if(group&&card.subject===group.subject&&card.topic===group.topic&&
     card.stage===group.stage&&!String(card.specRef||'').trim())
   card.specRef=group.specRef;
 }
 return existing;
}

// v314: individually reviewed core-card fixes. Keep stable IDs and saved progress.
function applyV314CoreMockQuality(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const id of ['task1_v162_023','task1_v171_003','task1_v171_004','task1_v171_005']){
  const c=byId.get(id);
  if(c&&c.subject==='Maths'&&c.topic==='Vectors'&&c.stage==='AS'&&c.specRef==='3.10')
   c.specRef='3.11'; // AQA vectors, not Numerical Methods
 }
 const momentum=byId.get('phy_mechanics_focus_v37_18');
 if(momentum&&momentum.subject==='Physics'&&momentum.stage==='AS')
  momentum.front='Two trolleys stick together. If total momentum is p and total mass is M, what is their common velocity?';
 const couple=byId.get('phy_mechanics_weakness_v35_couple_distance');
 if(couple&&couple.subject==='Physics'&&couple.stage==='AS')
  couple.front='In the couple formula M = Fd, what does distance d represent?';
 const bonding=byId.get('chem_bonding_v52_32');
 if(bonding&&bonding.subject==='Chemistry'&&bonding.stage==='AS'){
  bonding.front='Why is BF₃ non-polar even though its B–F bonds are polar?';
  bonding.back='Its three polar B–F bond dipoles cancel in a trigonal planar molecule.';
  bonding.accept=[
   bonding.back,
   'The three B-F bond dipoles cancel because BF3 is trigonal planar.',
   'The bond dipoles cancel due to trigonal planar symmetry.',
   'The polar B–F bonds are arranged symmetrically, so net dipole is zero.'
  ];
  bonding.reject=[
   'The B-F bonds are non-polar.',
   'BF3 is polar because B-F bonds are polar.',
   'The molecule has no bonds.'
  ];
 }
 // Eight individually reviewed historical short-recall cards previously had
 // loose or missing alternatives. Verified wrong examples must outrank token similarity.
 const markerCases=[
  ['phy_vectors_001','Physics',
   ['adjacent = F cos θ and opposite = F sin θ','Cosine for adjacent; sine for opposite.'],
   ['adjacent = F sin θ and opposite = F cos θ','horizontal is always F cos θ regardless of the given angle']],
  ['phy_slope_001','Physics',
   ['parallel = mg sin θ; perpendicular = mg cos θ','Weight down the plane mg sine θ, into plane mg cosine θ.'],
   ['parallel = mg cos θ; perpendicular = mg sin θ','both components are mg sin θ']],
  ['phy_motion_a','Physics',
   ['Δv','change in velocity','final velocity minus initial velocity'],
   ['displacement','distance travelled','acceleration']],
  ['phy_moments_001','Physics',
   ['Perpendicular separation from pivot to line of action','The shortest distance from the pivot to the force line'],
   ['the distance along the force direction','The length from the pivot to the point where force is applied regardless of angle']],
  ['phy_internal_001','Physics',
   ['emf − I r','epsilon minus current times internal resistance'],
   ['V = ε + Ir','V=Ir']],
  ['phy_photoelectric_002','Physics',
   ['Photons have insufficient energy hf to overcome the work function regardless of intensity.','Below threshold, increasing intensity raises photon number but not energy per photon.'],
   ['Increasing brightness gives each photon more energy.','More photons means an electron can combine energy from multiple photons to escape.']],
  ['chem_gas_001','Chemistry',
   ['Pa; m³; K; mol','Pressure pascals, volume cubic metres, temperature kelvin, amount moles.'],
   ['kPa, dm³, °C and moles','Pressure Pa, volume dm³, temperature kelvin and moles']],
  ['chem_empirical_001','Chemistry',
   ['Convert masses to moles, divide by the smallest mole value, and obtain whole number ratios.','mass to mole ratio then simplest integer ratio'],
   ['Use raw mass ratios directly as subscripts without dividing by molar masses.','Divide every mass by the largest mass and round immediately']]
 ];
 for(const [id,subject,accept,reject] of markerCases){
  const c=byId.get(id);
  if(!c||c.subject!==subject||c.stage!=='AS'||c.mock!==true)continue;
  c.accept=[...new Set([c.back,...(c.accept||[]),...accept])];
  c.reject=[...new Set([...(c.reject||[]),...reject])];
 }
 return existing;
}

// v315: exact-ID, answer-text and subject verified AS recall calibration.
// No new cards or changes to progress IDs, mock flags or original model answers.
const V315_REVIEWED_CORE_VARIANTS=Object.freeze([{"id":"phy_rp6","subject":"Physics","front":"For a graph of terminal p.d. V against current I, what are the intercept and gradient?","back":"y-intercept = emf ε and gradient = −r.","accept":["Intercept ε, gradient −r.","The V-axis intercept is emf and slope is minus internal resistance."],"reject":["Intercept is −r and gradient is ε.","Gradient is +r and intercept equals emf."]},{"id":"phy_stationary_nodes","subject":"Physics","front":"What are nodes and antinodes?","back":"Nodes have zero amplitude; antinodes have maximum amplitude.","accept":["Nodes: zero amplitude; antinodes: largest amplitude.","At a node the oscillation amplitude is zero and at an antinode it is maximum."],"reject":["Nodes have maximum amplitude and antinodes zero amplitude.","Both nodes and antinodes have zero amplitude."]},{"id":"phy_tir_conditions","subject":"Physics","front":"What are the two conditions for total internal reflection?","back":"Light travels from higher to lower refractive index and the incidence angle exceeds the critical angle.","accept":["From optically denser to rarer medium with i greater than critical angle.","Refractive index decreases across the boundary and incidence angle is above critical."],"reject":["Light travels from lower to higher refractive index above the critical angle.","Angle of incidence is smaller than the critical angle."]},{"id":"phy_projectile_independent","subject":"Physics","front":"What key idea lets you solve projectile motion?","back":"Horizontal and vertical motion are independent and share the same time.","accept":["Horizontal and vertical components are independent, using the same flight time.","Treat horizontal velocity separately from vertical acceleration but time is common."],"reject":["Horizontal and vertical accelerations are always equal.","Horizontal and vertical motions need different elapsed times."]},{"id":"phy_top_projectile","subject":"Physics","front":"At maximum height, what are vertical velocity and acceleration?","back":"Vertical velocity = 0; acceleration is still g downward.","accept":["Vertical speed is zero at the top, acceleration remains 9.8 m s⁻² downwards.","At the apex v_y=0 but a_y=−g if upwards is positive."],"reject":["Both vertical velocity and acceleration are zero at the top.","Acceleration points upwards at the maximum height."]},{"id":"phy_superposition","subject":"Physics","front":"What is the principle of superposition?","back":"When waves overlap, resultant displacement is the vector/algebraic sum of the individual displacements.","accept":["Resultant displacement is the sum of individual displacements where waves meet.","Add the signed displacements of overlapping waves."],"reject":["Add the amplitudes without considering signs at every point.","Overlapping waves always cancel completely."]},{"id":"phy_pandr_v29_work_function","subject":"Physics","front":"Define the work function φ.","back":"Minimum energy needed to remove an electron from a metal surface.","accept":["The minimum energy to liberate a photoelectron from the metal surface.","Least energy required for an electron to escape the surface of the material."],"reject":["The maximum kinetic energy of any emitted electron.","The energy of every photon incident on the metal."]},{"id":"phy_pandr_v29_threshold_frequency","subject":"Physics","front":"Define the threshold frequency f₀.","back":"Minimum photon frequency needed to emit photoelectrons from that metal.","accept":["The lowest light frequency that can release photoelectrons.","Minimum frequency for photoelectric emission from the surface."],"reject":["The maximum frequency that can cause emission.","The frequency at which every photon makes two electrons escape."]},{"id":"phy_pandr_v29_photo_eq","subject":"Physics","front":"Write Einstein's photoelectric equation.","back":"hf = φ + Eₖ(max).","accept":["hf = φ + KEmax","Photon energy equals work function plus maximum kinetic energy."],"reject":["hf = φ − KEmax","hf = KEmax − φ"]},{"id":"phy_pandr_v29_intensity_fixed_f","subject":"Physics","front":"How does increasing light intensity above threshold affect emission?","back":"More photoelectrons per second; no increase in maximum kinetic energy.","accept":["Photoelectron emission rate increases while maximum kinetic energy is unchanged.","More electrons are emitted per second; their highest kinetic energy stays the same."],"reject":["Maximum kinetic energy increases with intensity at fixed frequency.","Increasing intensity below threshold guarantees emission."]},{"id":"phy_pandr_v29_frequency_fixed_i","subject":"Physics","front":"How does increasing frequency above threshold affect photoelectrons?","back":"Maximum kinetic energy increases because Eₖ(max) = hf − φ.","accept":["Increasing light frequency above threshold increases the maximum photoelectron KE.","KEmax = hf − φ, so greater f produces greater KEmax."],"reject":["Maximum kinetic energy decreases as frequency rises above threshold.","Increasing frequency increases photon count only, not energy per photon."]},{"id":"phy_pandr_v29_stopping_eq","subject":"Physics","front":"How is stopping potential linked to maximum photoelectron energy?","back":"Eₖ(max) = eVₛ, using the magnitude of the stopping voltage.","accept":["Maximum kinetic energy is electron charge times the magnitude of stopping potential.","KEmax = e × |Vs|"],"reject":["KEmax = Vs/e","Stopping potential is unrelated to maximum kinetic energy."]},{"id":"chem_rp2","subject":"Chemistry","front":"What is the core calorimetry calculation?","back":"q = mcΔT, then ΔH = −q/n for the stated reacting amount.","accept":["Use q = mcΔT then divide heat released by reacting moles with a negative sign for exothermic ΔH.","Heat transfer q=mcΔT; ΔH=−q/n if q is heat gained by solution."],"reject":["ΔH = +q/n for solution warming in an exothermic reaction.","q = mΔT/c"]},{"id":"chem_rp3","subject":"Chemistry","front":"Why can 1/t be used as a measure of rate in a clock reaction?","back":"The same fixed amount of change defines the end point each time, so shorter time means faster rate.","accept":["The same fixed reaction change occurs at the endpoint so rate is proportional to 1/time.","Each trial reaches the same observable extent of reaction; faster reactions give shorter t."],"reject":["1/t is valid even if different amounts react before the endpoint.","Longer times mean faster initial rate."]},{"id":"chem_ionisation_def","subject":"Chemistry","front":"Define first ionisation energy.","back":"Energy required to remove one electron from each atom in one mole of gaseous atoms to form gaseous 1+ ions.","accept":["Energy to remove one electron from each atom in one mole of gaseous atoms, forming gaseous singly positive ions.","Energy for X(g) → X⁺(g) + e⁻ for one mole of gaseous X atoms."],"reject":["Energy required to remove a second electron from gaseous 1+ ions.","Energy released when gaseous ions gain an electron."]},{"id":"chem_ie_trend","subject":"Chemistry","front":"Why generally does first ionisation energy increase across a period?","back":"Nuclear charge increases while shielding is similar, so attraction to the outer electron increases and atomic radius falls.","accept":["Increasing nuclear charge with similar shielding strengthens attraction to the outer electron.","More protons across the period, similar shielding, so the atomic radius falls and outer electrons are more strongly attracted."],"reject":["More shielding across a period always causes the increase.","The atoms get larger across the period and hold outer electrons more strongly."]},{"id":"chem_ionic_bond","subject":"Chemistry","front":"What is ionic bonding?","back":"Electrostatic attraction between oppositely charged ions.","accept":["Strong electrostatic attraction between cations and anions.","Electrostatic force of attraction between oppositely charged positive and negative ions."],"reject":["Electrostatic attraction between neutral molecules.","A shared pair of electrons between two atoms is an ionic bond."]},{"id":"chem_metallic_bond","subject":"Chemistry","front":"What is metallic bonding?","back":"Electrostatic attraction between positive metal ions and delocalised electrons.","accept":["Attraction between positive metal ions and a sea of delocalised electrons.","Strong electrostatic attraction of metal cations to delocalised electrons."],"reject":["Attraction between shared electron pairs and two covalent nuclei.","Metallic bonding is electron transfer between two metal ions with no delocalised electrons."]},{"id":"chem_enthalpy_def","subject":"Chemistry","front":"Define standard enthalpy change of reaction.","back":"Enthalpy change when reactants in their standard states react in the stoichiometric equation under standard conditions.","accept":["The enthalpy change for the balanced reaction as written with reactants and products in standard states under standard conditions.","ΔH when the stoichiometric amounts specified in an equation react, all species in their standard states."],"reject":["Enthalpy change per one mole of any chosen reagent irrespective of the equation.","Enthalpy change measured for substances in arbitrary non-standard states."]},{"id":"chem_hess","subject":"Chemistry","front":"What principle is used in Hess cycles?","back":"Enthalpy change is independent of route because enthalpy is a state function.","accept":["Enthalpy change depends only on the starting and finishing states.","Because enthalpy is a state function, total ΔH is independent of the path."],"reject":["The enthalpy change depends on which intermediate reactions are chosen.","Hess law says all reactions have zero enthalpy change."]},{"id":"chem_displacement_halogen","subject":"Chemistry","front":"When will one halogen displace another halide?","back":"A more reactive/stronger oxidising halogen displaces the halide of a less reactive halogen.","accept":["A stronger oxidising halogen displaces the halide of a weaker oxidising halogen.","The halogen higher in Group 7 displaces a halide ion of a halogen lower down."],"reject":["Iodine displaces chloride ions from chloride solution.","A less reactive halogen displaces the halide of a more reactive halogen."]},{"id":"chem_elimination","subject":"Chemistry","front":"What conditions favour elimination of a halogenoalkane with OH⁻?","back":"Hot ethanolic hydroxide.","accept":["Hot ethanolic KOH.","Heat under reflux with alcoholic hydroxide rather than aqueous hydroxide."],"reject":["Cold dilute aqueous hydroxide favours elimination over substitution.","Use water alone at room temperature to favour elimination."]},{"id":"chem_mechanisms_v42_05","subject":"Chemistry","front":"In a radical chain mechanism, what is initiation?","back":"The formation of initial radicals through homolytic bond breaking.","accept":["Homolytic fission forms radicals to begin the chain.","Formation of free radicals by breaking a covalent bond homolytically."],"reject":["Two radicals react to form a stable molecule and start propagation.","A bond breaks heterolytically to give two free radicals."]},{"id":"chem_mechanisms_v42_07","subject":"Chemistry","front":"How does radical termination differ from propagation?","back":"Termination consumes radicals without creating new ones.","accept":["Termination removes radicals whereas propagation regenerates one.","Two radicals combine without producing a new radical, ending that chain."],"reject":["Termination generates another radical and continues the chain.","Propagation consumes all radicals without forming new ones."]},{"id":"math_proof_exhaust","subject":"Maths","front":"What is proof by exhaustion?","back":"Check every possible case in a finite set of possibilities.","accept":["Check every case in a finite, completely specified domain.","Verify each possible value in a finite set, showing none has been omitted."],"reject":["Test a few examples from an infinite set and assume the claim always holds.","Show a single example that satisfies the claim."]},{"id":"math_diff_gradient","subject":"Maths","front":"What does dy/dx represent geometrically?","back":"The gradient of the curve/tangent at that point.","accept":["The instantaneous rate of change, or tangent gradient, at the point.","Gradient of the tangent line to the graph at a given x."],"reject":["The signed area underneath the graph.","The gradient of the normal line at that point."]},{"id":"math_second_deriv","subject":"Maths","front":"How can d²y/dx² classify a stationary point?","back":"Positive: local minimum; negative: local maximum.","accept":["f''(x)>0 means a local minimum, f''(x)<0 a local maximum at a stationary point.","Second derivative positive: minimum; negative: maximum (when nonzero)."],"reject":["Positive second derivative implies a local maximum; negative implies minimum.","If the second derivative equals zero it always proves an inflection point."]},{"id":"math_trig_period","subject":"Maths","front":"What are the periods of sin x, cos x and tan x in degrees?","back":"sin and cos: 360°; tan: 180°.","accept":["Sine 360 degrees, cosine 360 degrees, tangent 180 degrees.","sin and cos repeat every full turn (360°), tan every half turn (180°)."],"reject":["Sine period 180°, cosine period 360°, tangent period 360°.","All three functions have period 360°."]},{"id":"math_a2_stationary_class","subject":"Maths","front":"If d²y/dx²=0 at a stationary point, what should you do?","back":"Do not classify it automatically; inspect derivative sign changes or use another valid argument.","accept":["Check sign changes of the first derivative; zero second derivative is inconclusive.","Use another valid test: f''=0 alone does not distinguish min, max or stationary inflection."],"reject":["Declare the point a minimum automatically.","A zero second derivative always implies a stationary point is a maximum."]},{"id":"task1_maths_001","subject":"Maths","front":"A translation by vector (a, b) does what to (x, y)?","back":"Maps it to (x + a, y + b).","accept":["(x,y) maps to (x+a,y+b)","Add a to the x-coordinate and b to the y-coordinate."],"reject":["(x,y) maps to (x−a,y−b)","Swap the coordinates, giving (y+a,x+b)."]},{"id":"task1_maths_002","subject":"Maths","front":"What does y = f(x − a) do to y = f(x)?","back":"Shifts the graph a units right.","accept":["A horizontal translation a units in the positive x-direction.","The graph moves right by a units (for a>0)."],"reject":["Translate the graph a units to the left.","The graph reflects in the x-axis."]},{"id":"task1_maths_011","subject":"Maths","front":"What is a counterexample?","back":"One example showing a universal claim is false.","accept":["One counterexample is a case for which a universal statement fails.","A single valid example disproving a universal claim."],"reject":["An example where the assertion happens to be true.","An untested assertion supporting the original claim."]},{"id":"task1_maths_012","subject":"Maths","front":"What does the derivative f′(x) represent?","back":"The instantaneous gradient of y = f(x).","accept":["Gradient of the tangent to y=f(x) at x.","Instantaneous rate of change of f with respect to x."],"reject":["The signed area under the curve.","The constant of integration of f(x)."]},{"id":"task1_v162_020","subject":"Maths","front":"State the first-principles definition of f′(x).","back":"lim(h→0) [f(x+h)−f(x)]/h.","accept":["f'(x) = lim(h→0) (f(x+h)−f(x))/h","lim_{h→0} [f(x+h)-f(x)]/h"],"reject":["f'(x) = lim(h→0) (f(x+h)+f(x))/h","f'(x) = (f(x+h)-f(x))/h for a fixed nonzero h"]},{"id":"task1_v162_021","subject":"Maths","front":"If the tangent gradient is m≠0, what is the normal gradient?","back":"−1/m.","accept":["The negative reciprocal, −1/m.","Normal slope = -1/m"],"reject":["Normal gradient equals m.","Normal gradient equals 1/m."]},{"id":"task1_v171_001","subject":"Maths","front":"What does proof by deduction involve?","back":"Logical steps from stated assumptions to a justified conclusion.","accept":["A logically valid sequence of implications from given assumptions to the statement.","Start with justified facts and derive the conclusion step by step."],"reject":["Test two numerical examples and declare it proved for all integers.","Give a counterexample to support the statement rather than deductive reasoning."]}]);
function applyV315CoreRecallCalibration(existing){
 const cardsById=new Map(existing.map(c=>[c.id,c]));
 for(const row of V315_REVIEWED_CORE_VARIANTS){
  const c=cardsById.get(row.id);
  if(!c||c.subject!==row.subject||c.stage!=='AS'||c.mock!==true||
     c.front!==row.front||c.back!==row.back)continue;
  c.accept=[...new Set([c.back,...(c.accept||[]),...row.accept])];
  c.reject=[...new Set([...(c.reject||[]),...row.reject])];
 }
 return existing;
}

// v316: precisely vetted existing Year 1/AS flashcard answers across all three school mocks.
// Patch only exact matching original IDs/fronts/answers; preserve every historical ID.
const V316_REVIEWED_CORE_VARIANTS=Object.freeze([{"id":"phy_motion_d","subject":"Physics","front":"What does the gradient of a displacement–time graph represent?","back":"Velocity. A steeper gradient means greater speed; a horizontal line means v = 0. On a curve, use a tangent for instantaneous velocity.","accept":["Velocity, equal to ds/dt.","Instantaneous velocity from tangent slope."],"reject":["Acceleration is the gradient of displacement–time graph.","Displacement is obtained from its gradient."]},{"id":"phy_motion_v","subject":"Physics","front":"What do the gradient and signed area of a velocity–time graph represent?","back":"Gradient = acceleration. Signed area under the graph = displacement.","accept":["Gradient is acceleration and signed area is displacement.","Slope gives a; algebraic area gives change in position."],"reject":["Gradient is displacement and area is acceleration.","Area always means total distance regardless of negative velocity."]},{"id":"phy_rp1","subject":"Physics","front":"What relationship is central to the stretched-string stationary-wave practical?","back":"f = (1/2L)√(T/μ).","accept":["f=(1/(2L))*sqrt(T/mu)","Fundamental frequency is proportional to sqrt(T/μ)/2L."],"reject":["f=2L*sqrt(T/mu)","Frequency is proportional to the mass per length rather than inversely to its square root."]},{"id":"phy_wave_speed","subject":"Physics","front":"What equation links wave speed, frequency and wavelength?","back":"v = fλ.","accept":["v=f×λ","Wave speed equals frequency multiplied by wavelength."],"reject":["v=f/λ","v=λ/f"]},{"id":"phy_stationary_spacing","subject":"Physics","front":"What is the separation of adjacent nodes in a stationary wave?","back":"λ/2.","accept":["Half a wavelength, λ/2.","Distance between neighbouring nodes is λ divided by 2."],"reject":["One wavelength, λ.","A quarter wavelength between adjacent nodes."]},{"id":"phy_refractive_index","subject":"Physics","front":"How is refractive index related to wave speed?","back":"n = c/v.","accept":["Refractive index n equals vacuum light speed divided by medium speed.","n=c/v."],"reject":["n=v/c","n=c×v"]},{"id":"phy_snell","subject":"Physics","front":"State Snell's law for two media.","back":"n₁ sin θ₁ = n₂ sin θ₂.","accept":["n1 sin(i)=n2 sin(r)","n₁ sin θ₁ = n₂ sin θ₂."],"reject":["n1 cos(i)=n2 cos(r)","n1 sin(r)=n2 sin(i) with i in medium 1."]},{"id":"phy_resultant_perp","subject":"Physics","front":"How do you find the magnitude of two perpendicular vector components x and y?","back":"R = √(x² + y²).","accept":["sqrt(x^2+y^2)","Pythagoras: magnitude R=√(x²+y²)."],"reject":["x+y is always the magnitude of the resultant.","R=√(x²−y²)"]},{"id":"phy_projectile_horizontal","subject":"Physics","front":"Ignoring air resistance, what is horizontal acceleration of a projectile?","back":"0 m s⁻².","accept":["Horizontal acceleration is zero.","a_x=0 in absence of air drag."],"reject":["Horizontal acceleration equals 9.81 m/s².","Horizontal acceleration increases during flight without resistance."]},{"id":"phy_potential_divider","subject":"Physics","front":"For two series resistors, how is output p.d. found?","back":"Vout = Vin × R₂/(R₁ + R₂), taking R₂ across the output.","accept":["Vout/Vin=R2/(R1+R2) when measured across R2.","Output across the second resistor is Vin R2 divided by total series resistance."],"reject":["Vout=Vin×R1/(R1+R2) when measured across R2.","Output voltage always equals supply voltage in a two-resistor divider."]},{"id":"phy_photoelectric_001","subject":"Physics","front":"What is the photon-energy condition for photoelectric emission?","back":"hf ≥ φ (photon energy at least the work function).","accept":["Photon energy hf must be at least φ.","Emission requires hf≥work function."],"reject":["hf<φ produces photoelectron emission.","Increasing intensity makes photons below work function emit electrons."]},{"id":"phy_pandr_v29_threshold_eq","subject":"Physics","front":"What equation relates threshold frequency and work function?","back":"hf₀ = φ; so f₀ = φ/h.","accept":["hf0=φ","Threshold frequency equals work function divided by Planck constant."],"reject":["hf0=φ+KEmax at threshold with positive KE.","f0=h/φ"]},{"id":"phy_pandr_v29_stopping_gradient","subject":"Physics","front":"For stopping potential against frequency, what is the gradient?","back":"Gradient = h/e.","accept":["h divided by the elementary charge e.","The gradient is Planck's constant over electron charge."],"reject":["e/h","Gradient equals the work function φ."]},{"id":"phy_pandr_v29_threshold_wavelength","subject":"Physics","front":"How do you calculate threshold wavelength from the work function?","back":"λ₀ = hc/φ. Emission requires λ ≤ λ₀.","accept":["Threshold wavelength λ0=hc/φ.","Maximum emission wavelength is hc divided by work function."],"reject":["λ0=φ/(hc)","Emission occurs only for λ>λ0."]},{"id":"phy_spectra_photo_v32_ke_range","subject":"Physics","front":"Why do photoelectrons have a range of kinetic energies?","back":"Electrons can lose varying energy inside the metal before escaping; Eₖ(max) is the upper limit.","accept":["Some electrons lose energy in the metal before reaching its surface.","Electrons start at different depths and may lose varying amounts of energy."],"reject":["All photoelectrons have identical kinetic energies.","Intensity alone determines each emitted electron's kinetic energy."]},{"id":"phy_spectra_photo_v32_intensity_stopping","subject":"Physics","front":"What happens to stopping potential if light intensity doubles at fixed frequency?","back":"It stays unchanged: photon energy and maximum photoelectron kinetic energy do not change.","accept":["Stopping potential remains constant at fixed frequency.","Unchanged; max KE is independent of light intensity at the same f."],"reject":["Stopping potential doubles if light intensity doubles at fixed frequency.","Doubling photon count doubles photon energy."]},{"id":"phy_mechanics_weakness_v35_slope_numeric","subject":"Physics","front":"For a 10 kg block on a 30° slope, what is the down-slope weight component?","back":"mg sin 30° = 10 × 9.81 × 0.5 = 49.1 N down the slope.","accept":["49.05 N down the slope.","10×9.81×sin30° = 49.1 N."],"reject":["98.1 N down the slope.","10×9.81×cos30° is the downslope component."]},{"id":"phy_graph_weakness_v36_s_negative","subject":"Physics","front":"On a displacement–time graph, what does a negative gradient mean?","back":"Negative velocity: the object moves in the negative direction. A steeper slope magnitude means greater speed.","accept":["Velocity is negative, i.e. movement in the negative displacement direction.","Moving towards decreasing displacement; the slope is the velocity."],"reject":["Negative gradient means negative acceleration.","A negative slope means the object's speed must decrease."]},{"id":"phy_graph_weakness_v36_v_signed_vs_distance","subject":"Physics","front":"A v–t graph gives +20 m and −8 m of signed area. Find displacement and distance.","back":"Displacement = 20−8 = +12 m. Total distance = 20+8 = 28 m.","accept":["Displacement +12 m, total distance 28 m.","Signed areas add to 12 m; absolute areas sum to 28 m."],"reject":["Displacement 28 m, distance 12 m.","Both displacement and distance are 12 m."]},{"id":"phy_graph_weakness_v36_v_negative_acceleration","subject":"Physics","front":"If velocity is negative and acceleration is negative, is the object slowing down?","back":"No. Velocity and acceleration have the same direction, so speed increases in the negative direction.","accept":["No; the object speeds up in the negative direction.","Its speed increases because v and a have the same negative sign."],"reject":["Yes, negative acceleration always slows a body.","The body has zero velocity because both quantities are negative."]},{"id":"chem_rp1","subject":"Chemistry","front":"What are the essential steps for making an accurate standard solution?","back":"Accurately weigh, dissolve, quantitatively transfer with washings, make to the mark, stopper and invert.","accept":["Weigh accurately, dissolve, rinse quantitatively into volumetric flask, make to mark, mix.","Dissolve and transfer with washings, then make up precisely and invert to mix."],"reject":["Fill flask to mark before transferring any measured solid.","Don't rinse beaker or funnel: the transfer is complete without washings."]},{"id":"chem_rp4","subject":"Chemistry","front":"What precipitate colours identify chloride, bromide and iodide after acidifying and adding AgNO₃?","back":"AgCl white, AgBr cream, AgI yellow.","accept":["Cl− white AgCl; Br− cream AgBr; I− yellow AgI.","White for chloride, cream for bromide, yellow for iodide."],"reject":["Cl− yellow, Br− cream, I− white.","All silver halides form identical white precipitates."]},{"id":"chem_rp5","subject":"Chemistry","front":"Where should the thermometer bulb be positioned during distillation?","back":"At the entrance to the condenser/still head, so it measures vapour entering the condenser.","accept":["The bulb sits by the still head at the condenser entrance.","Position it at the vapour outlet before the condenser."],"reject":["Thermometer bulb must be submerged in the boiling liquid.","Position the thermometer bulb inside the receiver to measure cold condensate."]},{"id":"chem_bondenthalpy","subject":"Chemistry","front":"Using mean bond enthalpies, how is ΔH estimated?","back":"Σ bonds broken − Σ bonds formed.","accept":["ΔH≈energy required breaking bonds minus energy released making bonds.","Sum bonds broken minus sum bonds formed."],"reject":["ΔH≈Σformed−Σbroken for mean bond enthalpies.","Bond formation is endothermic and bond breaking exothermic."]},{"id":"chem_group2_hydroxide","subject":"Chemistry","front":"How does Group 2 hydroxide solubility change down the group?","back":"It increases.","accept":["Group 2 hydroxides become more soluble down the group.","Their solubility increases as you descend Group 2."],"reject":["Solubility of Group 2 hydroxides decreases from Mg to Ba.","All Group 2 hydroxides are equally soluble."]},{"id":"chem_group2_sulfate","subject":"Chemistry","front":"How does Group 2 sulfate solubility change down the group?","back":"It decreases.","accept":["Sulfate solubility decreases going down Group 2.","Less soluble lower down Group 2."],"reject":["Group 2 sulfates become more soluble towards barium.","Barium sulfate is more soluble than magnesium sulfate."]},{"id":"chem_halogen_oxidising","subject":"Chemistry","front":"How does halogen oxidising power change down Group 7?","back":"It decreases.","accept":["Halogens become weaker oxidising agents down Group 7.","Oxidising ability declines from chlorine to bromine to iodine."],"reject":["Iodine is the strongest oxidising halogen.","Chlorine has lower oxidising power than iodine."]},{"id":"chem_halide_reducing","subject":"Chemistry","front":"How does halide-ion reducing power change down Group 7?","back":"It increases.","accept":["Halide ions become stronger reducing agents down Group 7.","Reducing power increases from chloride to bromide to iodide."],"reject":["Iodide is a weaker reducing agent than chloride.","Reducing power decreases as the halide ion becomes larger."]},{"id":"chem_radical_sub","subject":"Chemistry","front":"What are the three stages of free-radical substitution?","back":"Initiation, propagation and termination.","accept":["Initiation, propagation, termination.","First initiation, then propagation and finally termination."],"reject":["Propagation, elimination, hydrolysis.","Ionisation, acceleration and detection."]},{"id":"chem_halogeno_sub","subject":"Chemistry","front":"What mechanism occurs when OH⁻ reacts with a halogenoalkane to form an alcohol?","back":"Nucleophilic substitution.","accept":["Nucleophilic substitution by hydroxide ions.","OH− acts as a nucleophile replacing halide."],"reject":["Electrophilic addition of OH− to a halogenoalkane.","Free-radical substitution of the halo group by OH−."]},{"id":"chem_mechanisms_v42_08","subject":"Chemistry","front":"Why is the C atom bonded to a halogen electrophilic?","back":"Bond polarisation gives that carbon a partial positive charge.","accept":["Because C–X is polar, carbon carries δ+.","Halogen's higher electronegativity makes attached carbon partially positive."],"reject":["Carbon is electrophilic because it is negatively charged.","Carbon attracts nucleophiles because carbon is δ−."]},{"id":"chem_mechanisms_v42_09","subject":"Chemistry","front":"Which atom is approached by the nucleophile in substitution?","back":"The electron-poor carbon attached to the halogen.","accept":["The δ+ carbon in the carbon–halogen bond.","The carbon bonded to the leaving halogen."],"reject":["The electronegative halogen atom receives the nucleophile attack.","The nucleophile targets an unrelated non-electrophilic carbon by definition."]},{"id":"chem_mechanisms_v42_10","subject":"Chemistry","front":"Where do C–halogen bonding electrons go during substitution?","back":"To the departing halogen, which becomes a halide ion.","accept":["The bonding electron pair goes to the leaving halogen.","Heterolytic cleavage gives the halide X− the pair."],"reject":["The C–X bond electrons go to the carbon and halogen leaves as X+.","Both electrons are lost into the solvent without any leaving ion."]},{"id":"chem_mechanisms_v42_11","subject":"Chemistry","front":"What is the mechanistic difference between substitution and elimination?","back":"Substitution replaces a group; elimination removes atoms/groups to create C=C.","accept":["Substitution replaces a group; elimination forms a double bond by removal.","Substitution swaps atoms/groups; elimination removes HX to form an alkene."],"reject":["Elimination replaces the leaving halogen with OH− while substitution creates C=C.","Both mechanisms always yield an identical alcohol product."]},{"id":"chem_atomic_v43_13","subject":"Chemistry","front":"What does m/z mean in mass spectrometry?","back":"Mass-to-charge ratio; for a singly charged ion it matches the relative ion mass.","accept":["Mass-to-charge ratio m/z.","Ion mass divided by charge number."],"reject":["m/z is mass multiplied by charge.","The amount of protons in the sample only."]},{"id":"chem_atomic_v43_14","subject":"Chemistry","front":"What are the four core TOF stages in order?","back":"Ionisation → acceleration → ion drift → detection/data analysis.","accept":["Ionisation, acceleration, drift/flight, detection.","Ionise; accelerate; separate by time of flight; detect."],"reject":["Detection, acceleration, ionisation, flight.","Evaporation, condensation, filtration and crystallisation."]},{"id":"chem_atomic_v43_20","subject":"Chemistry","front":"What happens to positive ions in the acceleration stage?","back":"An electric field accelerates them, giving ions of equal charge equal kinetic energy.","accept":["The electric field accelerates charged ions; equal charges at same voltage gain equal kinetic energy.","Ions are sped up by an electric potential difference, gaining qV kinetic energy."],"reject":["Every ion of different charge necessarily has identical kinetic energy.","Ions slow down in the acceleration region regardless of potential."]},{"id":"chem_atomic_v43_24","subject":"Chemistry","front":"Why is a high vacuum used in the drift tube?","back":"To reduce collisions between moving ions and gas molecules.","accept":["High vacuum prevents most collisions with background gas.","Reduce collisions with residual gas molecules."],"reject":["To allow frequent ion-air collisions and slow them down.","To increase the mass of ions during flight."]},{"id":"chem_atomic_v43_27","subject":"Chemistry","front":"How does flight time change as mass increases at fixed KE and charge?","back":"It increases; t is proportional to the square root of mass.","accept":["Flight time gets longer, scaling as square root of mass at equal energy.","The more massive ion has lower speed and takes longer; t∝√m."],"reject":["Heavier ions travel faster at equal kinetic energy.","Flight time is directly proportional to mass rather than its square root."]},{"id":"chem_atomic_v43_30","subject":"Chemistry","front":"What does the height/intensity of a mass spectrum peak indicate?","back":"Relative abundance of the detected ion.","accept":["Peak intensity indicates ion relative abundance.","Relative number of ions detected at that m/z."],"reject":["Peak height represents ion mass-to-charge instead of abundance.","The tallest peak necessarily has the largest m/z."]},{"id":"maths_trig_001","subject":"Maths","front":"What is the Pythagorean trigonometric identity?","back":"sin²x + cos²x = 1.","accept":["sin²(x)+cos²(x)=1","Cosine squared plus sine squared equals one."],"reject":["sin²x−cos²x=1","sin x+cos x=1 for all x."]},{"id":"maths_transform_001","subject":"Maths","front":"For y = f(x − a), how does the graph move?","back":"Translate a units to the right.","accept":["Horizontal translation right by a (a>0).","x-coordinates increase by a for f(x−a)."],"reject":["Translate left by a.","Reflect the graph in the y-axis."]},{"id":"maths_transform_002","subject":"Maths","front":"For y = f(x) + a, how does the graph move?","back":"Translate a units upwards.","accept":["Vertical translation upwards by a units.","Each y-coordinate increases by a."],"reject":["Vertical translation down by a units.","The graph stretches vertically by factor a."]},{"id":"maths_transform_003","subject":"Maths","front":"For a > 0, what is the horizontal scale factor of y = f(ax)?","back":"1/a (x-coordinates are divided by a).","accept":["Horizontal scale factor 1/a.","All x-values are divided by a."],"reject":["Horizontal stretch by factor a for a>1.","Vertical stretch by scale factor a."]},{"id":"math_proof_counter","subject":"Maths","front":"How can a universal statement be disproved?","back":"Give one valid counterexample.","accept":["One counterexample disproves a universal statement.","Find one valid case where the claim fails."],"reject":["A single example supporting the assertion proves it for all cases.","Checking ten true cases proves the claim always holds."]},{"id":"math_arith_nth","subject":"Maths","front":"What is the nth term of an arithmetic sequence?","back":"uₙ = a + (n−1)d.","accept":["u_n=a+(n−1)d","First term plus n minus one times common difference."],"reject":["u_n=a×r^(n−1)","u_n=a+nd"]},{"id":"math_geom_nth","subject":"Maths","front":"What is the nth term of a geometric sequence?","back":"uₙ = ar^(n−1).","accept":["u_n=a r^(n−1)","First term multiplied by ratio to the n minus one power."],"reject":["u_n=a+(n−1)r","u_n=ar^n"]},{"id":"math_sine_rule","subject":"Maths","front":"State the sine rule.","back":"a/sin A = b/sin B = c/sin C.","accept":["a/sin(A)=b/sin(B)=c/sin(C)","sin A/a=sin B/b=sin C/c"],"reject":["a/sin(B)=b/sin(A)=c/sin(C)","a cos A=b cos B=c cos C"]},{"id":"math_cosine_rule","subject":"Maths","front":"State the cosine rule for side a.","back":"a²=b²+c²−2bc cos A.","accept":["a²=b²+c²−2bc cos A","Side a squared equals b squared plus c squared minus 2bc cos A."],"reject":["a²=b²+c²+2bc cos A","a²=b²+c²−2bc sin A"]},{"id":"math_triangle_area","subject":"Maths","front":"What is the area formula using two sides a,b and included angle C?","back":"Area = ½ab sin C.","accept":["Area=0.5 a b sin C","One half ab times sine of the included angle."],"reject":["Area=ab cos C","Area=a b sin C without the half."]},{"id":"math_diff_power","subject":"Maths","front":"Differentiate xⁿ.","back":"nx^(n−1).","accept":["d/dx[x^n] = n x^(n−1)","Use power rule, multiply by n and lower exponent by one."],"reject":["d/dx[x^n]=n x^n","Derivative of x^n is x^(n+1)/(n+1)."]},{"id":"math_stationary","subject":"Maths","front":"What condition identifies a stationary point?","back":"dy/dx = 0.","accept":["dy/dx=0","First derivative vanishes at a smooth stationary point."],"reject":["dy/dx is undefined at every stationary point.","The second derivative must be zero at every maximum."]},{"id":"math_integrate_power","subject":"Maths","front":"Integrate xⁿ for n≠−1.","back":"x^(n+1)/(n+1) + C.","accept":["∫ x^n dx = x^(n+1)/(n+1)+C, n≠−1","Raise the power by one then divide by the new power and add C."],"reject":["∫ x^n dx = n x^(n−1)+C","Indefinite integrals never need a constant."]},{"id":"math_area_curve","subject":"Maths","front":"How is signed area under y=f(x) from a to b found?","back":"∫ₐᵇ f(x) dx.","accept":["∫ from a to b of f(x)dx","Definite integral between a and b, keeping negative signed contributions."],"reject":["∫|f(x)| dx is always the signed integral.","Area beneath the x-axis counts as positive in the signed integral."]},{"id":"math_vector_mag","subject":"Maths","front":"Magnitude of vector (a,b)?","back":"√(a²+b²).","accept":["√(a²+b²)","Use Pythagoras on vector components."],"reject":["a+b","√(a²−b²)"]},{"id":"task1_maths_004","subject":"Maths","front":"What does y = f(−x) do to the graph?","back":"Reflects it in the y-axis.","accept":["Reflection in the y-axis.","Replacing x by −x mirrors horizontally across the vertical axis."],"reject":["Reflection in the x-axis.","Translate a units right."]},{"id":"task1_v162_002","subject":"Maths","front":"What transformation maps y = f(x) to y = −f(x)?","back":"Reflection in the x-axis.","accept":["Reflect the graph in the x-axis.","Negate each y-value while leaving the x-coordinates unchanged."],"reject":["Reflect the graph in the y-axis.","Translate the graph to the left."]},{"id":"task1_v162_003","subject":"Maths","front":"For a>0, what does y = f(x+a) do to y = f(x)?","back":"Translate a units to the left.","accept":["Horizontal shift a units left for a>0.","Replacing x with x+a moves the graph left."],"reject":["Horizontal shift a units right.","Vertical shift a units upwards."]},{"id":"task1_v162_006","subject":"Maths","front":"State the binomial coefficient nCr as a factorial formula.","back":"nCr = n! / [r!(n−r)!].","accept":["n!/[r!(n−r)!]","Number of combinations n choose r equals factorial n over factorial r times factorial n−r."],"reject":["n!/(r!+(n−r)!)","n!/r!"]},{"id":"task1_v162_007","subject":"Maths","front":"What is the general x^r term in (a+bx)^n for a positive integer n?","back":"nCr × a^(n−r) × (bx)^r.","accept":["(n choose r)a^(n−r)(bx)^r","Binomial coefficient times a to n−r times (bx) to r."],"reject":["nCr×a^r×(bx)^(n−r) for the x^r term.","a^(n−r)(bx)^r without a binomial coefficient."]}]);
function applyV316CoreRecallCalibration(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V316_REVIEWED_CORE_VARIANTS){
  const card=byId.get(row.id);
  if(!card||card.subject!==row.subject||card.stage!=='AS'||card.mock!==true||
     card.front!==row.front||card.back!==row.back)continue;
  card.accept=[...new Set([card.back,...(card.accept||[]),...row.accept])];
  card.reject=[...new Set([...(card.reject||[]),...row.reject])];
  card.v316ExactReviewed=true;
 }
 return existing;
}

// v321: exact-ID answer correction for 45 individually reviewed legacy core mock cards.
const V321_REVIEWED_CORE_VARIANTS=[{"id":"phy_diffraction","subject":"Physics","front":"When is diffraction most noticeable?","back":"When the gap size is comparable with the wavelength.","accept":["strongest spreading occurs when gap width is about a wavelength","aperture comparable in size to lambda"],"reject":["diffraction is greatest when the gap is much larger than the wavelength","diffraction requires a wave to be absorbed"]},{"id":"phy_emf","subject":"Physics","front":"Define emf.","back":"Energy supplied by the source per unit charge.","accept":["work done by the power source per unit charge","the source's supplied energy divided by charge"],"reject":["emf is the energy transferred per second","emf equals resistance multiplied by time"]},{"id":"phy_focus_v38_05","subject":"Physics","front":"State Newton's first law precisely, including the condition on resultant force.","back":"If resultant external force is zero, an object stays at rest or moves at constant velocity in a straight line.","accept":["with zero net external force an object stays at rest or travels at constant velocity","zero resultant force implies no change in velocity"],"reject":["zero resultant force means the object must come to rest","constant velocity always requires a nonzero resultant force"]},{"id":"phy_focus_v38_06","subject":"Physics","front":"State Newton's second law in its general momentum form.","back":"Resultant external force equals the rate of change of momentum, in the force direction: F = Δp/Δt (or dp/dt).","accept":["net external force is dp/dt","the rate of momentum change equals the resultant force"],"reject":["net force equals momentum divided by displacement","F equals momentum multiplied by time"]},{"id":"phy_focus_v38_08","subject":"Physics","front":"A heavy lorry hits a small car. Which experiences the greater force during their interaction?","back":"Neither: by Newton's third law their interaction forces have equal magnitude, opposite direction; accelerations can differ.","accept":["the truck and car exert equal and opposite forces on each other","their interaction forces are the same magnitude by Newton's third law"],"reject":["the heavier lorry exerts a bigger force","the lighter car exerts a bigger force because its acceleration is greater"]},{"id":"phy_focus_v39_01","subject":"Physics","front":"Why does the normal reaction on a simple slope not equal the full weight?","back":"The surface balances only the perpendicular component, mg cosθ; weight mg is vertical.","accept":["only the perpendicular component of weight, mg cos theta, is supported by the plane","on a simple incline the normal reaction balances mg cos theta"],"reject":["the normal reaction must equal mg on any incline","the normal reaction always equals mg sin theta"]},{"id":"phy_focus_v39_02","subject":"Physics","front":"On a slope, why resolve weight parallel and perpendicular to the surface?","back":"Normal acceleration is zero; along the slope there may be a resultant force and acceleration.","accept":["perpendicular components balance but along-slope resultant can accelerate the body","resolving separates the normal balance and possible parallel acceleration"],"reject":["all the weight acts only along the slope","there is always a nonzero acceleration perpendicular to a fixed slope"]},{"id":"phy_focus_v39_04","subject":"Physics","front":"Why can't you double ascent time to find flight time when a projectile lands below launch height?","back":"The vertical journey is asymmetric; use vertical displacement and solve a quadratic for landing time.","accept":["the descent is not symmetric about maximum height when final height differs","the landing level is lower so use vertical displacement and solve for the total time"],"reject":["flight time always equals twice the time to the maximum height","horizontal motion determines the flight time without vertical displacement"]},{"id":"phy_focus_v39_05","subject":"Physics","front":"What happens to a projectile's horizontal velocity at its highest point?","back":"It is unchanged without air resistance; only vertical velocity is zero at the top.","accept":["the horizontal velocity is constant if air resistance is ignored","at the top vx is unchanged whereas vy is zero"],"reject":["the projectile's horizontal velocity becomes zero at its peak","gravity makes the horizontal velocity increase with time when drag is absent"]},{"id":"phy_focus_v39_06","subject":"Physics","front":"Given velocity components vₓ and vᵧ just before impact, how do you find impact speed?","back":"Impact speed is √(vₓ² + vᵧ²), not merely the magnitude of the vertical velocity.","accept":["use Pythagoras on velocity components: sqrt(vx^2+vy^2)","speed equals the magnitude of the vector with components vx and vy"],"reject":["impact speed is always just the vertical component","impact speed is vx plus vy even when perpendicular"]},{"id":"phy_focus_v39_07","subject":"Physics","front":"If v<0 and a<0, what happens to speed?","back":"Speed increases because velocity and acceleration point in the same negative direction.","accept":["the object speeds up when v and a are both negative","acceleration in the direction of negative velocity increases the magnitude of v"],"reject":["a negative acceleration always reduces speed","negative velocity always means the object is slowing down"]},{"id":"phy_force_time_area","subject":"Physics","front":"What does area under a force–time graph represent?","back":"Impulse, equal to change in momentum.","accept":["integrating force with respect to time gives change in momentum","the area represents impulse in newton seconds"],"reject":["force-time graph area is mechanical work in joules","force-time area gives acceleration directly"]},{"id":"phy_graph_v118_01","subject":"Physics","front":"Displacement–time: what does a negative gradient mean?","back":"Velocity is negative: motion in the negative direction, not necessarily slowing down.","accept":["a negative displacement-time slope means velocity is negative","it moves in the negative direction and may speed up or slow down"],"reject":["negative displacement-time gradient proves the object is decelerating","a negative gradient means positive velocity"]},{"id":"phy_graph_v118_04","subject":"Physics","front":"Why is total distance different from displacement on a v–t graph?","back":"Distance sums all absolute areas; displacement uses signed areas.","accept":["add absolute areas for distance but algebraic signed areas for displacement","total distance counts both positive and negative velocity regions as positive"],"reject":["distance equals positive area minus the magnitude of negative area","signed area always gives total distance travelled"]},{"id":"phy_graph_v118_06","subject":"Physics","front":"Acceleration–time area gives which quantity?","back":"Change in velocity, not displacement or distance.","accept":["the signed integral of acceleration over time is delta v","the area of a against time gives the velocity change"],"reject":["area under acceleration-time is displacement","acceleration-time area directly gives total distance"]},{"id":"chem_acyl_chloride_alcohol","subject":"Chemistry","front":"What does an acyl chloride form with an alcohol?","back":"An ester and HCl.","accept":["acyl chloride and alcohol produce an ester plus hydrogen chloride","an ester forms and HCl is released"],"reject":["an acyl chloride and alcohol produce an amide","the main products are an aldehyde and hydrogen"]},{"id":"chem_acyl_chloride_water","subject":"Chemistry","front":"What happens when an acyl chloride reacts with water?","back":"A carboxylic acid and HCl are formed.","accept":["water hydrolyses an acyl chloride to the carboxylic acid and HCl","hydrolysis yields RCOOH and hydrogen chloride"],"reject":["hydrolysis produces a primary amide","acyl chloride and water produce an alcohol and chlorine gas"]},{"id":"chem_acyl_review_v41_01","subject":"Chemistry","front":"What is the general formula of an acyl chloride?","back":"R–C(=O)–Cl.","accept":["RCOCl","R-C(=O)-Cl"],"reject":["RCOOH","RCOOR"]},{"id":"chem_acyl_review_v41_02","subject":"Chemistry","front":"What is an acyl group?","back":"R–C(=O)–, the group transferred in acylation.","accept":["RCO- is the acyl group","R-C(=O)-, transferred in acylation"],"reject":["R-OH is the acyl group","the acyl group is -NH2"]},{"id":"chem_acyl_review_v41_03","subject":"Chemistry","front":"What group links the two carbonyls in an acid anhydride?","back":"A bridging oxygen: RCO–O–COR′.","accept":["one oxygen links the two acyl groups","anhydride linkage is -C(=O)-O-C(=O)-"],"reject":["a nitrogen connects the two carbonyl groups","the carbonyl carbons bond directly without oxygen"]},{"id":"chem_acyl_review_v41_04","subject":"Chemistry","front":"What is an amide functional group?","back":"A carbonyl directly bonded to nitrogen, e.g. –CONH₂.","accept":["an amide contains -C(=O)-N-","the functional group has a nitrogen attached directly to a carbonyl carbon"],"reject":["an amide contains only C-N single bonds without a carbonyl","the amide functional group is -COO-"]},{"id":"chem_acyl_review_v41_05","subject":"Chemistry","front":"How does an amide differ structurally from an amine?","back":"An amide N is bonded to C=O; an amine N is not.","accept":["amide nitrogen is attached to a carbonyl carbon whereas an amine nitrogen is not","an amide has C(=O)-N bonding; an amine lacks that adjacent carbonyl"],"reject":["an amine always has a carbonyl directly bonded to nitrogen","there is no structural difference between an amine and an amide"]},{"id":"chem_acyl_review_v41_06","subject":"Chemistry","front":"What type of mechanism is acyl chloride acylation?","back":"Nucleophilic addition–elimination.","accept":["nucleophilic addition followed by elimination","nucleophilic addition-elimination mechanism"],"reject":["electrophilic substitution","free radical substitution"]},{"id":"chem_acyl_review_v41_07","subject":"Chemistry","front":"What makes the acyl carbon attractive to a nucleophile?","back":"The carbonyl carbon is electron-poor (δ+).","accept":["the partial positive carbonyl carbon is electrophilic","polar C=O leaves carbon electron deficient"],"reject":["the carbonyl carbon has a full negative charge","nucleophiles attack because the acyl carbon has excess lone pairs"]},{"id":"chem_acyl_review_v41_08","subject":"Chemistry","front":"In acylation mechanisms, where should the nucleophile's arrow point?","back":"Toward the electrophilic carbonyl carbon.","accept":["curly arrow from nucleophile lone pair to carbonyl carbon","the arrow head points to the electron deficient carbon of C=O"],"reject":["curly arrow begins at carbonyl carbon and ends at the nucleophile","arrow points towards the chloride rather than the carbonyl carbon during initial addition"]},{"id":"chem_acyl_review_v41_09","subject":"Chemistry","front":"What happens to the C=O bonding electron pair during initial attack?","back":"It moves towards the oxygen atom.","accept":["the carbonyl pi electrons move onto oxygen","a curly arrow goes from C=O pi bond to the oxygen atom"],"reject":["the C=O electron pair moves onto chloride ion","the carbonyl pi electrons move to the nucleophile"]},{"id":"chem_acyl_review_v41_10","subject":"Chemistry","front":"What shape does the carbonyl carbon adopt in the addition intermediate?","back":"Approximately tetrahedral.","accept":["carbonyl carbon becomes roughly tetrahedral in the addition intermediate","the intermediate has tetrahedral arrangement at acyl carbon"],"reject":["the carbonyl carbon stays linear during the nucleophilic addition","the intermediate carbonyl carbon has a 180 degree bond angle"]},{"id":"chem_acyl_review_v41_11","subject":"Chemistry","front":"What change reforms C=O during the elimination stage?","back":"An oxygen lone pair reforms the carbon–oxygen double bond.","accept":["oxygen lone pair returns to reform the carbonyl pi bond","the oxyanion lone pair forms C=O again"],"reject":["chloride donates its lone pair to form the C=O bond","the carbonyl bond reforms by losing an electron from oxygen to solvent"]},{"id":"chem_acyl_review_v41_12","subject":"Chemistry","front":"Which type of species is displaced from an acyl chloride intermediate?","back":"A chloride ion, Cl−, acts as the leaving group.","accept":["chloride leaves as Cl-","a chloride ion is expelled from the tetrahedral intermediate"],"reject":["an OH- ion leaves from the acyl chloride in this step","the acyl carbon atom is the leaving group"]},{"id":"chem_acyl_review_v41_13","subject":"Chemistry","front":"Why is nucleophilic acylation called addition–elimination?","back":"The nucleophile adds before a leaving group is expelled.","accept":["nucleophile addition is followed by leaving group elimination","an incoming nucleophile adds before chloride is expelled"],"reject":["the leaving group is expelled before any nucleophile attacks","addition elimination means electrons are never transferred in bonds"]},{"id":"math_geom_infinite","subject":"Maths","front":"When does a geometric series have a sum to infinity, and what is it?","back":"If |r|<1, S∞ = a/(1−r).","accept":["for absolute r less than one the limiting sum is a divided by one minus r","|r|<1 and S_infinity=a/(1-r)"],"reject":["a geometric series converges to a/(1-r) whenever r>1","the sum to infinity equals a/(1+r) for all ratios"]},{"id":"math_modulus","subject":"Maths","front":"What does y=|f(x)| do to a graph?","back":"Reflects any part below the x-axis in the x-axis; parts above stay unchanged.","accept":["the negative portions of f(x) are reflected in the x-axis","parts with y below zero are mapped to positive y; positive parts stay put"],"reject":["reflect the whole graph in the y-axis","the graph of |f(x)| retains negative y values"]},{"id":"math_arith_sum","subject":"Maths","front":"What is the sum of the first n terms of an arithmetic sequence?","back":"Sₙ = n/2[2a+(n−1)d].","accept":["S_n=(n/2)(2a+(n-1)d)","half of n times first plus last term, S_n=n(a+l)/2"],"reject":["S_n=n(2a+(n+1)d)/2","S_n=a(1-r^n)/(1-r)"]},{"id":"math_binomial","subject":"Maths","front":"What is the general term in (a+b)ⁿ?","back":"C(n,r) a^(n−r) b^r.","accept":["the general term is nCr multiplied by a to n-r multiplied by b to r","choose n r times a^(n-r) times b^r"],"reject":["the general term is nCr a^r b^r","the general term is a^(n-r)+b^r"]},{"id":"math_circle","subject":"Maths","front":"What is the equation of a circle centre (a,b), radius r?","back":"(x−a)²+(y−b)²=r².","accept":["a circle centred at (a,b) has (x-a)^2+(y-b)^2=r^2","(x-a)^2+(y-b)^2 equals the radius squared"],"reject":["(x+a)^2+(y+b)^2=r^2 for centre (a,b)","(x-a)^2+(y-b)^2=r"]},{"id":"math_circle_tangent","subject":"Maths","front":"How is a tangent to a circle related to the radius at the contact point?","back":"They are perpendicular.","accept":["radius and tangent are at right angles at their point of contact","the tangent is perpendicular to the radius at the touching point"],"reject":["a tangent is parallel to the radius at contact","a circle tangent always passes through its centre"]},{"id":"math_geom_sum","subject":"Maths","front":"What is the finite geometric sum?","back":"Sₙ = a(1−rⁿ)/(1−r), for r≠1.","accept":["sum equals a times (1-r to the n) divided by (1-r)","S_n=a(1-r^n)/(1-r), r not equal to one"],"reject":["S_n=a(1+r^n)/(1-r)","S_n=a/(1-r) for any finite n"]},{"id":"math_indices_frac","subject":"Maths","front":"For positive integer n, what does x^(1/n) mean wherever it is real?","back":"The real nth root of x.","accept":["x^(1/n) is the nth root of x where real","raising x to one over n gives its real nth root"],"reject":["x^(1/n) means x divided by n","x^(1/n) equals n times x"]},{"id":"math_indices_neg","subject":"Maths","front":"For x ≠ 0 and positive integer n, what is x⁻ⁿ?","back":"1/xⁿ.","accept":["x to negative n is the reciprocal of x to positive n","x^-n=1/(x^n) for nonzero x"],"reject":["x^-n=-x^n","x^-n=x/n"]},{"id":"math_tan_identity","subject":"Maths","front":"State the tan identity.","back":"tan x = sin x / cos x.","accept":["tan(x)=sin(x)/cos(x) wherever cos x is nonzero","the tangent ratio equals sine divided by cosine"],"reject":["tan x=cos x/sin x","tan x=sin x times cos x"]},{"id":"task1_v124_bulk_math_004","subject":"Maths","front":"What condition must a differentiable function satisfy at a stationary point?","back":"f′(x) = 0.","accept":["the first derivative must equal zero at a differentiable stationary point","stationary at x=a requires f'(a)=0"],"reject":["a stationary point requires f(a)=0","a stationary point occurs whenever f''(a)=0"]},{"id":"task1_v124_bulk_math_008","subject":"Maths","front":"What is a counterexample in mathematical proof?","back":"One case showing a universal claim is false.","accept":["a valid example that disproves a general assertion","one instance satisfying the assumptions where the claimed result fails"],"reject":["an example which confirms the claim for one value","any value outside the specified domain"]},{"id":"task1_v136_001","subject":"Maths","front":"What is the quadratic formula for ax² + bx + c = 0?","back":"x = (−b ± √(b² − 4ac)) / (2a).","accept":["x=(-b plus or minus sqrt(b^2-4ac))/(2a)","x equals minus b plus or minus the square root of discriminant all over 2a"],"reject":["x=(b plus or minus sqrt(b^2-4ac))/(2a)","x=(-b plus or minus sqrt(b^2+4ac))/(2a)"]},{"id":"task1_v136_007","subject":"Maths","front":"What is the sum of n terms of an arithmetic progression?","back":"Sₙ = n[2a + (n−1)d]/2.","accept":["the nth partial arithmetic sum is n/2[2a+(n-1)d]","S_n=n(a+l)/2 for first term a and last term l"],"reject":["S_n=n/2[2a+(n+1)d]","S_n=a(1-r^n)/(1-r)"]},{"id":"task1_v136_008","subject":"Maths","front":"What is the sum of n terms of a geometric progression?","back":"Sₙ = a(1−rⁿ)/(1−r), when r ≠ 1.","accept":["for r not equal to one, S_n=a(1-r^n)/(1-r)","a times one minus r to n divided by one minus r"],"reject":["S_n=a/(1-r) for every finite n","S_n=a(1+r^n)/(1-r)"]}];
function applyV321CoreRecallCalibration(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V321_REVIEWED_CORE_VARIANTS){
  const card=byId.get(row.id);
  if(!card||card.subject!==row.subject||card.front!==row.front||card.back!==row.back)continue;
  card.accept=[...new Set([card.back,...(card.accept||[]),...row.accept])];
  card.reject=[...new Set([...(card.reject||[]),...row.reject])];
  card.v321ExactReviewed=true;
 }
 return existing;
}

// v322: 60 more original school mock recall cards, vetted by exact ID and original wording.
const V322_REVIEWED_CORE_VARIANTS=[{"id":"phy_annihilation","subject":"Physics","front":"What happens in particle–antiparticle annihilation?","back":"Their rest mass/energy is converted to photons while energy and momentum are conserved.","accept":["A particle and its antiparticle annihilate to produce photons, conserving energy and momentum."],"reject":["Annihilation converts all energy into a single photon without needing to conserve momentum."]},{"id":"phy_couple_001","subject":"Physics","front":"What is a couple, and what is the moment of a couple?","back":"Two equal, opposite, parallel forces with separated lines of action. Resultant force = 0. Moment of the couple = Fd, where d is the perpendicular separation.","accept":["A couple is two equal and opposite parallel forces acting at different lines of action; net force is zero and moment is one force times perpendicular separation."],"reject":["A couple is a single force whose moment equals force multiplied by time."]},{"id":"phy_electron_diffraction_exam_q9b","subject":"Physics","front":"Why do electron-diffraction rings shrink at higher accelerating voltage?","back":"Momentum rises, so de Broglie wavelength and diffraction angle fall.","accept":["Greater accelerating potential increases electron momentum, reducing de Broglie wavelength and the scattering angle."],"reject":["Increasing the accelerating voltage makes the electron wavelength longer and diffraction rings wider."]},{"id":"phy_energy_levels_001","subject":"Physics","front":"How is atomic excitation different from the photoelectric effect?","back":"Excitation moves an electron to a higher bound energy level. The photoelectric effect removes an electron from the metal.","accept":["Atomic excitation raises an electron within bound levels whereas photoelectric emission ejects an electron from a surface."],"reject":["Excitation and the photoelectric effect both simply raise the electron to a higher bound level."]},{"id":"phy_fbd_common_forces","subject":"Physics","front":"What common forces might appear on a free-body diagram?","back":"Weight acts vertically down; normal contact force acts perpendicular to a surface; tension acts along a string; drag/friction acts opposite relative motion or its tendency.","accept":["Include weight vertically down, normal force perpendicular to contact, tension along a cord, and friction opposing relative movement."],"reject":["The normal reaction points vertically down on any slope and friction always acts uphill."]},{"id":"phy_focus_v38_01","subject":"Physics","front":"A projectile is launched horizontally. What changes if the launch height doubles while speed stays constant?","back":"Time of fall and horizontal range both increase by a factor of √2 (assuming no air resistance).","accept":["Both the fall time and the horizontal range scale by the square root of two if the launch height is doubled."],"reject":["Doubling the height doubles the flight time for a horizontal launch."]},{"id":"phy_focus_v38_03","subject":"Physics","front":"A ball is thrown horizontally at 15 m s⁻¹ from a 45 m cliff. Find its range (g=10 m s⁻²).","back":"45 = ½(10)t² ⇒ t=3 s. Range = horizontal speed × time = 15×3 = 45 m.","accept":["t = sqrt(2h/g) = 3 seconds and horizontal range = 15 times 3 = 45 metres."],"reject":["The range is 15 m because the horizontal launch speed never changes."]},{"id":"phy_focus_v38_07","subject":"Physics","front":"State Newton's third law and explain why the two forces do not cancel.","back":"Interacting objects exert equal, opposite forces of the same type on each other, acting on different objects, so they do not cancel on one object.","accept":["The third-law pair has equal and opposite forces on different bodies, so they do not cancel on one body."],"reject":["Action and reaction cancel because both forces act on the same object."]},{"id":"phy_focus_v39_03","subject":"Physics","front":"A force pulls a block at angle α above an inclined plane. How does this affect R?","back":"The outward pull reduces R: if there are no other normal forces, R = mg cosθ − F sinα.","accept":["The force has an outward perpendicular component F sin alpha, so R = mg cos theta - F sin alpha."],"reject":["The outward pulling force makes the normal reaction increase by F sin alpha."]},{"id":"phy_focus_v39_08","subject":"Physics","front":"How does Newton's second law differ from the third law?","back":"Second: net force on ONE object changes its momentum. Third: forces pair across TWO interacting objects.","accept":["Newton II describes the effect of resultant force on one body; Newton III pairs forces on two different bodies."],"reject":["Newton's second and third laws both refer to two forces that act on the same body."]},{"id":"phy_focus_v39_10","subject":"Physics","front":"How can graph-axis units identify whether an area is impulse or work?","back":"Force×time gives N s (impulse); force×displacement gives N m or J (work).","accept":["Area of F against time has units N s and is impulse; area of F against distance has units N m or joules and is work."],"reject":["An area of force against time is work measured in joules."]},{"id":"phy_graph_v118_02","subject":"Physics","front":"What does zero gradient on a displacement–time graph show?","back":"Zero velocity: stationary at that instant or throughout a flat segment.","accept":["A zero displacement-time gradient means instantaneous velocity is zero."],"reject":["A zero displacement-time slope shows constant nonzero speed."]},{"id":"phy_graph_v118_05","subject":"Physics","front":"A straight sloping v–t line crosses zero. What changes?","back":"Direction changes if velocity changes sign; speed falls to zero then rises.","accept":["When the velocity crosses zero and reverses sign the body changes direction, with speed first dropping to zero."],"reject":["Crossing v=0 on a velocity-time graph means acceleration has become zero."]},{"id":"phy_graph_v118_07","subject":"Physics","front":"For curved s–t graphs, how is instantaneous velocity found?","back":"Find the gradient of the tangent at that time.","accept":["Draw a tangent at the chosen point of the curved displacement-time plot and calculate its slope."],"reject":["Find instantaneous velocity by taking the total area under the displacement-time graph."]},{"id":"phy_graph_v118_08","subject":"Physics","front":"How do you identify acceleration on a v–t graph?","back":"Gradient Δv/Δt; a horizontal line means zero acceleration.","accept":["Acceleration is the slope of velocity versus time, so a flat section corresponds to zero acceleration."],"reject":["The area under the velocity-time graph always gives the acceleration."]},{"id":"phy_graph_v118_09","subject":"Physics","front":"On a 30° slope, which component of weight pulls downhill?","back":"mg sin30°; the perpendicular component is mg cos30°.","accept":["Weight downhill component is mg sin(30 degrees), with mg cos(30 degrees) normal to the plane."],"reject":["The component of weight downhill on a 30 degree slope is mg cos 30 degrees."]},{"id":"phy_graph_v118_10","subject":"Physics","front":"A horizontal push up a slope does what to the reaction?","back":"It adds a component into the surface, increasing the normal reaction.","accept":["A horizontal force up the incline has an inward normal component, so it raises the reaction."],"reject":["A horizontal push uphill always reduces the normal contact reaction."]},{"id":"phy_graph_v118_11","subject":"Physics","front":"What is the moment of two equal opposite forces forming a couple?","back":"One force × perpendicular separation of their lines of action.","accept":["The couple moment is Fd, using the perpendicular distance between the two force lines."],"reject":["The moment of a couple is Fd/2 using the full separation d."]},{"id":"phy_graph_v118_12","subject":"Physics","front":"What does the gradient of a displacement vs t² graph give in free fall?","back":"g/2, for release from rest with negligible drag.","accept":["For release from rest s=(1/2)gt squared, so the slope of s against t squared is g/2."],"reject":["The slope of displacement against time squared is always g, even starting from rest."]},{"id":"phy_graph_weakness_v36_a_area_numeric","subject":"Physics","front":"Acceleration stays at +3.0 m s⁻² for 4.0 s. Find the velocity change.","back":"Signed area under a–t = 3.0×4.0 = +12 m s⁻¹.","accept":["Delta v is +3.0 times 4.0, which equals +12 m/s."],"reject":["The change in velocity is 0.75 m/s."]},{"id":"chem_a2_entropy_def","subject":"Chemistry","front":"What is entropy, qualitatively?","back":"A measure of disorder of a system, related to the possible arrangements of particles and energy.","accept":["Entropy describes the spread or dispersal of energy among possible arrangements, often approximated as disorder."],"reject":["Entropy is simply the total heat released by a reaction."]},{"id":"chem_acyl_review_v41_14","subject":"Chemistry","front":"Why is a proton-transfer step often shown at the end?","back":"To obtain the neutral product after an O- or N-containing nucleophile adds.","accept":["A final proton transfer can remove the extra hydrogen and leave a neutral ester or amide product."],"reject":["The final proton transfer is always needed to create a carbon-carbon double bond."]},{"id":"chem_acyl_review_v41_15","subject":"Chemistry","front":"What is the organic product class of acyl chloride hydrolysis?","back":"A carboxylic acid.","accept":["Hydrolysing an acyl chloride yields a carboxylic acid."],"reject":["Hydrolysing an acyl chloride directly gives a primary amide."]},{"id":"chem_acyl_review_v41_16","subject":"Chemistry","front":"What is the organic product class of alcohol acylation?","back":"An ester.","accept":["Acylating an alcohol yields an ester."],"reject":["Acylation of an alcohol yields an alkene as the main organic product."]},{"id":"chem_acyl_review_v41_17","subject":"Chemistry","front":"What is the organic product class when ammonia is acylated?","back":"A primary amide, RCONH₂.","accept":["Acyl chloride plus ammonia gives an unsubstituted primary amide, RCONH2."],"reject":["Ammonia acylation gives an N,N-disubstituted amide."]},{"id":"chem_acyl_review_v41_18","subject":"Chemistry","front":"What is the organic product class when a primary amine is acylated?","back":"An N-substituted amide, RCONHR′.","accept":["An acyl chloride and primary amine form an N-substituted amide."],"reject":["A primary amine reacts with an acyl chloride to make an alcohol."]},{"id":"chem_acyl_review_v41_19","subject":"Chemistry","front":"Which by-product distinguishes acyl chlorides from acid anhydrides?","back":"Acyl chlorides give HCl; anhydrides give a carboxylic acid.","accept":["Acyl chloride reactions make HCl, while corresponding acid anhydrides produce a carboxylic acid as by-product."],"reject":["Acyl chlorides produce ethanoic acid as by-product and anhydrides produce HCl."]},{"id":"chem_acyl_review_v41_20","subject":"Chemistry","front":"What is the main organic product of acid anhydride hydrolysis?","back":"Carboxylic acids.","accept":["Acid anhydride hydrolysis gives carboxylic acids."],"reject":["Hydrolysing an acid anhydride forms a ketone and oxygen gas."]},{"id":"chem_acyl_review_v41_21","subject":"Chemistry","front":"What main organic product classes arise from anhydride alcoholysis?","back":"An ester and a carboxylic acid.","accept":["An acid anhydride and an alcohol form an ester together with a carboxylic acid."],"reject":["Anhydride alcoholysis produces an ester and hydrogen chloride."]},{"id":"chem_acyl_review_v41_22","subject":"Chemistry","front":"What type of amide forms from anhydride and ammonia?","back":"A primary amide.","accept":["The product class is a primary amide, RCONH2."],"reject":["Anhydride and ammonia produce a tertiary amide."]},{"id":"chem_acyl_review_v41_23","subject":"Chemistry","front":"What type of amide forms from anhydride and a primary amine?","back":"An N-substituted amide.","accept":["Acylation of a primary amine by an anhydride yields an N-substituted amide."],"reject":["Acid anhydride and primary amine chiefly give an ester."]},{"id":"chem_acyl_review_v41_24","subject":"Chemistry","front":"What does the N- prefix mean in the name N-methylethanamide?","back":"A methyl substituent is bonded to the amide nitrogen.","accept":["N-methyl means methyl is attached directly to the nitrogen of the amide group."],"reject":["N-methyl means the methyl group attaches to the oxygen of the carbonyl."]},{"id":"chem_acyl_review_v41_25","subject":"Chemistry","front":"What is the name of CH₃COCl?","back":"Ethanoyl chloride.","accept":["CH3COCl is called ethanoyl chloride."],"reject":["CH3COCl is named ethyl chloride."]},{"id":"chem_acyl_review_v41_26","subject":"Chemistry","front":"What is the name of (CH₃CO)₂O?","back":"Ethanoic anhydride.","accept":["(CH3CO)2O is ethanoic anhydride."],"reject":["(CH3CO)2O is ethanoyl chloride."]},{"id":"chem_acyl_review_v41_27","subject":"Chemistry","front":"What is the name of CH₃CONH₂?","back":"Ethanamide.","accept":["CH3CONH2 is called ethanamide."],"reject":["CH3CONH2 is ethylamine."]},{"id":"chem_acyl_review_v41_29","subject":"Chemistry","front":"Which functional group in salicylic acid becomes an ester in aspirin?","back":"The phenolic O–H group.","accept":["Aspirin formation esterifies the phenol hydroxyl on salicylic acid."],"reject":["In making aspirin the carboxylic acid group is converted into a primary amide."]},{"id":"chem_acyl_review_v41_30","subject":"Chemistry","front":"What organic by-product is associated with aspirin made using ethanoic anhydride?","back":"Ethanoic acid.","accept":["The side product of making aspirin with ethanoic anhydride is ethanoic acid."],"reject":["Aspirin synthesis using ethanoic anhydride releases HCl."]},{"id":"chem_amount_v44_13","subject":"Chemistry","front":"How is the limiting reagent identified?","back":"Compare moles available divided by their balanced-equation coefficients.","accept":["Divide each available amount in moles by its coefficient in the balanced equation and choose the smallest."],"reject":["The reactant with the smallest mass in grams must be limiting."]},{"id":"chem_amount_v44_14","subject":"Chemistry","front":"Why must a limiting-reagent calculation consider stoichiometry?","back":"Equal numbers of moles do not imply reactants are present in required ratios.","accept":["The chemical equation coefficients determine the required mole ratios, so simply comparing mole counts is insufficient."],"reject":["Stoichiometric coefficients can be ignored when identifying which reagent is limiting."]},{"id":"chem_amount_v44_23","subject":"Chemistry","front":"Write the net ionic equation for acid–alkali neutralisation.","back":"H⁺(aq)+OH⁻(aq)→H₂O(l).","accept":["H+(aq) + OH-(aq) -> H2O(l)."],"reject":["The net ionic equation for neutralisation is H+(aq) + Cl-(aq) -> HCl(aq)."]},{"id":"math_complete_square","subject":"Maths","front":"Why is completing the square useful for a quadratic?","back":"It reveals the turning point and helps solve or sketch the quadratic.","accept":["Completing the square exposes the vertex and makes solving or plotting a quadratic easier."],"reject":["Completing the square changes the roots and therefore creates a different quadratic."]},{"id":"math_quad_discriminant","subject":"Maths","front":"What does the discriminant tell you?","back":"For ax²+bx+c, Δ=b²−4ac: >0 two real roots, =0 repeated root, <0 no real roots.","accept":["Delta=b squared minus 4ac; positive means two real roots, zero a repeated root, negative no real roots."],"reject":["If the discriminant is negative a quadratic has two distinct real roots."]},{"id":"task1_v124_bulk_math_009","subject":"Maths","front":"How does tan x relate to sin x and cos x?","back":"tan x = sin x / cos x.","accept":["Tangent is sin x over cos x."],"reject":["tan x equals cos x divided by sin x."]},{"id":"task1_v130_155","subject":"Maths","front":"What does a counterexample establish?","back":"A universal statement is false.","accept":["One counterexample is sufficient to refute a universal assertion."],"reject":["One example that supports a statement proves it for every real number."]},{"id":"task1_v136_009","subject":"Maths","front":"What is the sum to infinity for a convergent geometric series?","back":"S∞ = a/(1−r), valid when |r| < 1.","accept":["For absolute value of r below one, S infinity equals a over one minus r."],"reject":["The sum to infinity formula is valid for every common ratio greater than one."]},{"id":"task1_v136_062","subject":"Maths","front":"What does a zero discriminant tell you about a quadratic?","back":"It has one repeated real root.","accept":["There is a repeated real solution when the discriminant is zero."],"reject":["Zero discriminant means no real solutions."]},{"id":"task1_v136_066","subject":"Maths","front":"What does Σ from r=1 to n mean?","back":"Add the listed expression for r = 1, 2, …, n.","accept":["Summation from r=1 to n adds terms for each integer r from one through n."],"reject":["Sigma from 1 to n means multiply each of the terms."]},{"id":"task1_v136_067","subject":"Maths","front":"For a geometric sum, what happens when r=1?","back":"All n terms equal a, so Sₙ = na.","accept":["When r=1 every term is a, making the sum n times a."],"reject":["With ratio one, the geometric sum is a/(1-1)."]},{"id":"task1_v136_070","subject":"Maths","front":"What does f′(a)=0 tell you about a smooth curve?","back":"It has a stationary point at x=a.","accept":["At x=a the curve has zero gradient and so is stationary."],"reject":["The equation f'(a)=0 always means f(a)=0."]},{"id":"task1_v136_071","subject":"Maths","front":"Why is the constant of integration needed in an indefinite integral?","back":"All antiderivatives differ by a constant.","accept":["Indefinite integration gives a family of antiderivatives differing by a constant."],"reject":["The constant can be omitted because all indefinite integrals have a unique antiderivative."]},{"id":"task1_v162_001","subject":"Maths","front":"For a>1, what does y = af(x) do to y = f(x)?","back":"A vertical stretch by scale factor a.","accept":["Multiplying f(x) by a stretches vertically by scale factor a."],"reject":["The transformation y=af(x) stretches horizontally by factor a."]},{"id":"task1_v162_004","subject":"Maths","front":"For a positive integer n, what does n! mean?","back":"n! = n × (n−1) × … × 2 × 1.","accept":["n factorial is the product of all positive integers from one to n."],"reject":["n! means n plus (n-1) plus all earlier positive integers."]},{"id":"task1_v162_005","subject":"Maths","front":"What is the factorial of zero (0!)?","back":"1.","accept":["Zero factorial is equal to one."],"reject":["0! equals zero."]},{"id":"task1_v162_008","subject":"Maths","front":"In the recurrence uₙ₊₁ = f(uₙ), how is the next term found?","back":"Substitute the previous term uₙ into f.","accept":["Find the next term by evaluating f at the preceding term."],"reject":["The next term always equals the previous term plus one."]},{"id":"task1_v162_009","subject":"Maths","front":"When is a sequence strictly increasing?","back":"When every term is greater than the previous one.","accept":["Every consecutive difference u_(n+1)-u_n must be positive."],"reject":["Strictly increasing means successive terms are allowed to be equal."]},{"id":"task1_v162_010","subject":"Maths","front":"For an upward-opening quadratic with two distinct roots, where is f(x)>0?","back":"Outside the roots.","accept":["For an upward parabola with two distinct real roots, positive f(x) lies left of the smaller root and right of the larger."],"reject":["An upward quadratic is positive only between its two real roots."]},{"id":"task1_v162_011","subject":"Maths","front":"What happens to an inequality sign when multiplying by a negative number?","back":"Reverse the inequality sign.","accept":["Reverse the direction of the inequality whenever multiplying both sides by a negative."],"reject":["Multiplying both sides of an inequality by minus one keeps the inequality direction unchanged."]},{"id":"task1_v162_014","subject":"Maths","front":"What does a perpendicular from a circle's centre to a chord do?","back":"It bisects the chord.","accept":["A line from the centre perpendicular to a chord divides that chord into two equal lengths."],"reject":["The perpendicular from a circle's centre divides the chord into unequal lengths."]},{"id":"task1_v162_015","subject":"Maths","front":"What is the angle in a semicircle, subtended by its diameter?","back":"90°.","accept":["The angle opposite a diameter on a circle is a right angle."],"reject":["The angle in a semicircle is always 180 degrees."]},{"id":"task1_v162_016","subject":"Maths","front":"What is the exact value of sin 30°?","back":"1/2.","accept":["sin of thirty degrees equals one half."],"reject":["sin 30 degrees equals square root three over two."]}];
function applyV322CoreRecallCalibration(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V322_REVIEWED_CORE_VARIANTS){
  const card=byId.get(row.id);
  if(!card||card.subject!==row.subject||card.front!==row.front||card.back!==row.back)continue;
  card.accept=[...new Set([card.back,...(card.accept||[]),...row.accept])];
  card.reject=[...new Set([...(card.reject||[]),...row.reject])];
  card.v322ExactReviewed=true;
 }
 return existing;
}

// v324: carefully reviewed original core school-mock answers across 47 topic families.
// One refraction model was factually incomplete; both TIR conditions are now compulsory.
const V324_REVIEWED_CORE_VARIANTS=[{"id":"phy_accuracy_precision","subject":"Physics","section":"Measurement errors and uncertainty","front":"Accuracy vs precision?","originalBack":"Accuracy is closeness to the true value; precision is closeness of repeated readings to each other.","accept":["Accuracy refers to closeness to the true value; precision refers to consistency of repeated readings."],"reject":["Accuracy is the spread between repeated readings and precision measures closeness to the true value."]},{"id":"phy_measure_recap_20261024_gradient_uncert","subject":"Physics","section":"Measurement errors and uncertainty","front":"How is a percentage gradient uncertainty estimated from graph lines?","originalBack":"|Best gradient − worst acceptable gradient| ÷ |best gradient| × 100%.","accept":["Percentage gradient uncertainty is 100 times the difference between best and worst acceptable slope divided by the magnitude of the best slope."],"reject":["Gradient uncertainty is found by multiplying the worst slope by the best slope."]},{"id":"phy_measure_recap_20261024_uncert_add","subject":"Physics","section":"Measurement errors and uncertainty","front":"How do you combine uncertainties when adding or subtracting measurements?","originalBack":"Add the absolute uncertainties.","accept":["For a sum or difference of measured quantities add their absolute uncertainties."],"reject":["Subtract the absolute uncertainties whenever measurements are subtracted."]},{"id":"phy_resolve_weakness_20261025_marked_angle","subject":"Physics","section":"Resolving vectors and forces","front":"When resolving a vector, what decides whether to use sin or cos?","originalBack":"Look at the marked angle: adjacent side uses cos θ; opposite side uses sin θ. Never rely on horizontal or vertical.","accept":["Use cosine for the component adjacent to the marked angle and sine for the opposite component."],"reject":["Always use cosine for the horizontal component regardless of the stated angle."]},{"id":"phy_graph_weakness_v36_a_negative_area","subject":"Physics","section":"Motion and its graphs","front":"What does area below the time axis on an acceleration–time graph mean?","originalBack":"A negative change in velocity, not a negative distance. It need not mean the object slows down.","accept":["Area beneath the axis on an acceleration versus time graph gives negative delta v; it does not necessarily mean slowing down."],"reject":["Negative area on an acceleration-time plot must represent negative distance travelled."]},{"id":"phy_mechanics_weakness_v35_slope_direction","subject":"Physics","section":"Forces and slopes","front":"On a slope, which way do weight and its two components act?","originalBack":"Weight mg acts vertically down; mg sin θ acts down the slope; mg cos θ acts into the slope.","accept":["Weight acts vertically down; its parallel component mg sin theta goes down the slope and its normal component mg cos theta goes into the slope."],"reject":["Weight acts perpendicular to the slope rather than vertically down."]},{"id":"phy_mechanics_focus_v37_13","subject":"Physics","section":"Projectile motion","front":"Ignoring air resistance, which force acts on a projectile after release?","originalBack":"Only weight (gravity) acts, vertically downwards; no forward driving force is needed.","accept":["After launch and ignoring air resistance, only gravitational force acts on the projectile."],"reject":["An ideal released projectile needs a constant horizontal driving force to keep moving."]},{"id":"phy_mechanics_weakness_v35_couple_distance","subject":"Physics","section":"Moments and couples","front":"In the couple formula M = Fd, what does distance d represent?","originalBack":"d is the perpendicular separation between the forces' lines of action. Use just one F; don't double Fd.","accept":["In M=Fd, d is the shortest perpendicular distance between the lines of action of the equal opposite forces."],"reject":["In a couple, d is the distance travelled by either force during the turn."]},{"id":"phy_graph_weakness_v36_force_time_tri","subject":"Physics","section":"Momentum and impulse","front":"Force rises 0→80 N then returns to 0 over 0.20 s. Find impulse.","originalBack":"Area of triangular F–t graph = ½×0.20×80 = 8.0 N s (change in momentum).","accept":["Impulse equals one half times 80 newtons times 0.20 seconds, which is 8.0 N s."],"reject":["The impulse is 16 N s because the force-time region is a rectangle."]},{"id":"phy_mechanics_focus_v37_21","subject":"Physics","section":"Energy power efficiency","front":"An object's kinetic energy rises from 5 J to 30 J. What is the net work done on it?","originalBack":"W_net = ΔE_k = 30−5 = +25 J.","accept":["Net work done equals final minus initial kinetic energy, 30 J minus 5 J equals +25 J."],"reject":["The net work done is negative 25 J because kinetic energy increased."]},{"id":"phy_graph_weakness_v36_stress_strain_gradient","subject":"Physics","section":"Materials stress strain Young modulus","front":"What does gradient of a stress (y) against strain (x) graph give?","originalBack":"Young modulus E in the linear elastic region: E = stress ÷ strain (in Pa).","accept":["The straight-line elastic stress-strain gradient represents Young modulus, measured in pascals."],"reject":["The gradient of stress against strain has no units because strain has no units."]},{"id":"task1_phy_037","subject":"Physics","section":"Progressive waves and phase","front":"What phase difference is half a cycle?","originalBack":"π radians or 180°.","accept":["Half a full oscillation corresponds to a phase difference of pi radians or 180 degrees."],"reject":["A half-cycle phase difference is pi over two radians."]},{"id":"task1_phy_054","subject":"Physics","section":"Diffraction interference and gratings","front":"What is fringe spacing?","originalBack":"Distance between adjacent bright fringes or adjacent dark fringes.","accept":["Fringe spacing means the separation between successive bright fringes, or between successive dark fringes."],"reject":["Fringe spacing is always the distance between a bright and neighbouring dark fringe."]},{"id":"task1_phy_047","subject":"Physics","section":"Stationary waves and harmonics","front":"How far apart are adjacent stationary-wave nodes?","originalBack":"Half a wavelength, λ/2.","accept":["Consecutive nodes in a stationary wave are separated by lambda divided by two."],"reject":["Adjacent nodes in a stationary wave are one full wavelength apart."]},{"id":"task1_phy_064","subject":"Physics","section":"Refraction and optical fibres","front":"When can total internal reflection occur?","originalBack":"Light travels from higher to lower refractive index.","revisedBack":"When light travels from higher to lower refractive index AND the incidence angle exceeds the critical angle.","accept":["Total internal reflection needs incidence from a higher refractive index into a lower one at an angle greater than the critical angle."],"reject":["Light travels from higher to lower refractive index.","The angle of incidence exceeds the critical angle."]},{"id":"phy_pandr_v29_instant_emission","subject":"Physics","section":"Photoelectric effect","front":"Why is photoelectric emission effectively immediate above threshold?","originalBack":"One photon transfers its energy to one electron in one interaction.","accept":["With frequency above threshold an individual photon gives its energy to an electron in a single event, so emission has essentially no delay."],"reject":["Photoelectrons must accumulate energy gradually from many low-frequency photons over a long time."]},{"id":"phy_antiparticle","subject":"Physics","section":"Particles quarks and interactions","front":"How does an antiparticle compare with its particle?","originalBack":"Same mass and rest energy, but opposite charge and other additive quantum numbers.","accept":["An antiparticle has the same mass as its corresponding particle but opposite electric charge where charged and opposite additive quantum numbers."],"reject":["An antiparticle has a smaller rest mass than the corresponding particle."]},{"id":"task1_practical_012","subject":"Physics","section":"Electricity and potential dividers","front":"Which graph is used to find a cell's emf and internal resistance?","originalBack":"Terminal p.d. V against current I.","accept":["Plot terminal potential difference V against current I; y intercept gives emf and negative gradient gives internal resistance."],"reject":["Plot internal resistance against time to read emf from the slope."]},{"id":"phy_mechanics_focus_v37_25","subject":"Physics","section":"Energy power efficiency","front":"A device receives 150 J and transfers 60 J usefully. Calculate efficiency.","originalBack":"Efficiency = useful output/input = 60/150 = 0.40 = 40%.","accept":["Useful energy divided by input energy is 60 over 150, giving efficiency 0.4 or 40 percent."],"reject":["Efficiency is 250 percent because input divided by useful output is 150/60."]},{"id":"task1_phy_066","subject":"Physics","section":"Refraction and optical fibres","front":"What causes an optical fibre to guide light?","originalBack":"Total internal reflection at its boundary.","accept":["Fibre light is guided by total internal reflection at the core-cladding interface."],"reject":["Light is guided because the core repeatedly absorbs and re-emits every photon."]},{"id":"chem_atomic_v43_08","subject":"Chemistry","section":"Atomic structure isotopes mass spectra","front":"Why do isotopes often have similar chemical properties?","originalBack":"They have the same electron arrangements despite differing neutron numbers.","accept":["Isotopes of an element usually react similarly because their electrons are arranged in the same way."],"reject":["Isotopes of the same element differ in the number of outer-shell electrons."]},{"id":"chem_atomic_v43_39","subject":"Chemistry","section":"Electron configuration and ionisation","front":"Write the first ionisation equation for magnesium.","originalBack":"Mg(g) → Mg⁺(g) + e⁻.","accept":["Mg(g) -> Mg+(g) + e-."],"reject":["Mg+(g) -> Mg2+(g) + e- is the first ionisation equation."]},{"id":"chem_amount_v44_02","subject":"Chemistry","section":"Amount calculations and titration","front":"How should percentages be treated when calculating empirical formula?","originalBack":"Assume a 100 g sample; percentage values become gram masses.","accept":["Take a hypothetical 100 g sample so each percentage becomes a mass in grams."],"reject":["Convert each percentage directly to its atomic number before finding the mole ratio."]},{"id":"chem_bonding_v47_01","subject":"Chemistry","section":"Shapes covalent and ionic bonding","front":"State the complete definition of ionic bonding.","originalBack":"Strong electrostatic attraction between oppositely charged ions in a lattice.","accept":["Ionic bonding is the strong electrostatic attraction between oppositely charged ions."],"reject":["Ionic bonding is the sharing of electron pairs between two neutral atoms."]},{"id":"chem_bonding_v47_31","subject":"Chemistry","section":"Intermolecular forces and structure","front":"Why can graphite conduct along its layers?","originalBack":"Delocalised electrons move through the layers.","accept":["Graphite has mobile delocalised electrons that can carry charge along the carbon layers."],"reject":["Graphite conducts because whole carbon atoms freely move through the layers."]},{"id":"chem_bh_defs_20261024_atomisation_def","subject":"Chemistry","section":"Calorimetry and enthalpy","front":"Define enthalpy of atomisation.","originalBack":"The enthalpy change when 1 mole of gaseous atoms forms from an element in its standard state.","accept":["The enthalpy change to form one mole of gaseous atoms from the element in its standard state."],"reject":["Atomisation enthalpy is the formation of one mole of liquid atoms from gas."]},{"id":"chem_energetics_v49_42","subject":"Chemistry","section":"Hess cycles and bond enthalpy","front":"What happens to a Hess enthalpy when an equation is reversed?","originalBack":"Change the sign.","accept":["Reversing the direction of a chemical reaction changes the sign of its enthalpy change."],"reject":["If a Hess equation is reversed its delta H remains unchanged in sign."]},{"id":"task1_chem_084","subject":"Chemistry","section":"Group 2 and group 7","front":"What is the trend in Group 2 sulfate solubility?","originalBack":"Solubility decreases down the group.","accept":["Group 2 sulfates become less soluble as the group is descended."],"reject":["Group 2 sulfate solubility rises as the metal gets heavier."]},{"id":"task1_chem_099","subject":"Chemistry","section":"Inorganic tests and observations","front":"What colour precipitate indicates chloride with silver ions?","originalBack":"White (AgCl).","accept":["AgCl forms a white precipitate with silver ions."],"reject":["A chloride ion gives a yellow precipitate of silver chloride."]},{"id":"chem_k_units","subject":"Chemistry","section":"Rates and initial rates","front":"How do you determine units of the rate constant k?","originalBack":"Rearrange the rate equation and substitute the units of rate and concentration.","accept":["Divide the units of rate by the concentration units raised to the powers in the rate law."],"reject":["Every rate constant has units per second independent of overall order."]},{"id":"chem_arrhenius_001","subject":"Chemistry","section":"Arrhenius activation energy","front":"For a graph of ln k against 1/T, what are the gradient and y-intercept?","originalBack":"Gradient = −Ea/R. y-intercept = ln A. Temperature must be in kelvin.","accept":["On ln k plotted against 1/T, the slope is minus Ea over R and the intercept is ln A."],"reject":["The gradient is positive Ea/R and the y intercept is zero for every reaction."]},{"id":"chem_kp_pressure","subject":"Chemistry","section":"Kp gaseous equilibrium","front":"Does changing total pressure at constant temperature change Kp?","originalBack":"No. It may change equilibrium position, but Kp itself is unchanged at fixed temperature.","accept":["At a fixed temperature changing pressure can alter equilibrium composition but not the value of Kp."],"reject":["Kp always increases when the total equilibrium pressure is increased at constant temperature."]},{"id":"chem_lattice_form","subject":"Chemistry","section":"Born Haber and lattice enthalpy","front":"How is lattice formation enthalpy related to lattice dissociation enthalpy?","originalBack":"Same magnitude, opposite sign.","accept":["Lattice formation and lattice dissociation enthalpies have equal absolute values with opposite signs."],"reject":["Lattice formation and dissociation enthalpies always have the same sign."]},{"id":"chem_gibbs_001","subject":"Chemistry","section":"Entropy and Gibbs free energy","front":"State the Gibbs free-energy equation and the unit rule.","originalBack":"ΔG = ΔH − TΔS. T in K; use matching energy units for ΔH and TΔS (convert J to kJ if needed).","accept":["Delta G equals delta H minus T delta S; T must be in kelvin and entropy and enthalpy must use consistent units."],"reject":["Delta G equals delta H plus T delta S, and temperature must be in degrees Celsius."]},{"id":"chem_ka","subject":"Chemistry","section":"Strong weak acids pH Ka Kw","front":"Write the Ka expression for HA ⇌ H⁺ + A⁻.","originalBack":"Ka = [H⁺][A⁻]/[HA].","accept":["For HA dissociation, Ka is [H+][A-]/[HA]."],"reject":["For HA, Ka equals [HA]/([H+][A-])."]},{"id":"task1_chem_128","subject":"Chemistry","section":"Halogenoalkane substitution elimination","front":"What bond property makes halogenoalkanes reactive?","originalBack":"The C–halogen bond is polar.","accept":["The carbon-halogen bond is polar because the halogen is more electronegative than carbon."],"reject":["The carbon-halogen bond is nonpolar and therefore attracts nucleophiles."]},{"id":"task1_chem_145","subject":"Chemistry","section":"Alcohol oxidation and dehydration","front":"What group identifies an alcohol?","originalBack":"Hydroxyl, –OH.","accept":["Alcohols contain the hydroxyl functional group, -OH."],"reject":["The functional group of an alcohol is -COOH."]},{"id":"chem_mechanisms_v42_27","subject":"Chemistry","section":"Optical isomerism and chirality","front":"What is required for a common chiral carbon centre?","originalBack":"Four different substituent groups.","accept":["A tetrahedral carbon bearing four distinct substituents is commonly a chiral centre."],"reject":["A carbon attached to two identical groups is always a chiral centre."]},{"id":"chem_mechanisms_v42_20","subject":"Chemistry","section":"Aldehydes ketones carbonyl tests","front":"Why are carbonyl compounds attacked at carbon?","originalBack":"Their C=O bond is polar, with carbon δ+.","accept":["The carbonyl carbon is partially positive because oxygen attracts the shared bond electrons."],"reject":["Nucleophiles attack carbonyl carbon because the carbon atom carries a full negative charge."]},{"id":"chem_esterification","subject":"Chemistry","section":"Carboxylic acids esters and acyl","front":"What are the reagents and catalyst for esterification?","originalBack":"A carboxylic acid + alcohol, with concentrated H₂SO₄ catalyst and heat/reflux.","accept":["React an alcohol with a carboxylic acid using concentrated sulfuric acid as catalyst and heating under reflux."],"reject":["An ester forms by heating an alcohol and a ketone without any catalyst."]},{"id":"chem_acyl_chloride_ammonia","subject":"Chemistry","section":"Amines amides and acylation","front":"What organic product is formed when an acyl chloride reacts with ammonia?","originalBack":"A primary amide.","accept":["Acyl chloride with ammonia gives a primary amide."],"reject":["Ammonia reacts with an acyl chloride to form an ester."]},{"id":"chem_spec_v40_019","subject":"Chemistry","section":"Biodiesel triglycerides saponification","front":"What are the main products of triglyceride saponification?","originalBack":"Soap (long-chain carboxylate salts) and glycerol.","accept":["Alkaline triglyceride hydrolysis yields glycerol and salts of long-chain carboxylic acids, called soaps."],"reject":["Saponification of a triglyceride produces only glycerol and no salts."]},{"id":"chem_amount_v44_33","subject":"Chemistry","section":"Chemistry required practical accuracy","front":"Why are two burette readings included in uncertainty?","originalBack":"A titre is a difference; uncertainty arises from both final and initial readings.","accept":["A titre uses the difference between a starting and an ending burette reading so both reading uncertainties contribute."],"reject":["Only the final burette reading contributes uncertainty to a titre."]},{"id":"math_exp_inverse","subject":"Maths","section":"Functions inequalities transformations","front":"What functions are inverses of each other?","originalBack":"y=eˣ and y=ln x.","accept":["The exponential y=e^x and natural logarithm y=ln x are inverse functions."],"reject":["The inverse of y=e^x is y=1/e^x."]},{"id":"task1_maths_007","subject":"Maths","section":"Functions inequalities transformations","front":"What is the domain of a function?","originalBack":"Its permitted input values.","accept":["The domain is the set of all permitted input values of the function."],"reject":["The domain is the set of actual output values."]},{"id":"math_perp_grad","subject":"Maths","section":"Coordinate geometry and circles","front":"How are gradients of perpendicular non-vertical lines related?","originalBack":"m₁m₂ = −1.","accept":["For two nonvertical perpendicular lines, the product of their gradients is -1."],"reject":["Two nonvertical perpendicular lines must have equal gradients."]},{"id":"task1_v136_006","subject":"Maths","section":"Coordinate geometry and circles","front":"State the point–gradient form of a straight-line equation.","originalBack":"y − y₁ = m(x − x₁).","accept":["y-y1=m(x-x1) for a line of gradient m through (x1,y1)."],"reject":["y-y1=m(x+x1) is always the point-gradient equation."]},{"id":"v33_card_maths_sequences_87","subject":"Maths","section":"Sequences and series","front":"When does an infinite geometric series have a finite sum?","originalBack":"When the common ratio satisfies |r|<1.","accept":["An infinite geometric series converges when the magnitude of the common ratio is less than one."],"reject":["A geometric series has a finite infinite sum whenever r is greater than 1."]},{"id":"task1_v162_017","subject":"Maths","section":"Trigonometry degrees and identities","front":"What is the exact value of sin 45°?","originalBack":"√2/2.","accept":["The exact value of sin 45 degrees is root two divided by two."],"reject":["sin 45 degrees equals square root three divided by two."]},{"id":"task1_v162_018","subject":"Maths","section":"Trigonometry degrees and identities","front":"What is the exact value of cos 30°?","originalBack":"√3/2.","accept":["cos 30 degrees is root three over two."],"reject":["cos 30 degrees equals one half."]},{"id":"task1_v171_005","subject":"Maths","section":"Trigonometry degrees and identities","front":"After using tan⁻¹(y/x) for a vector's angle, what should you check?","originalBack":"The quadrant, using the signs of both components.","accept":["Determine the quadrant from the signs of x and y, then correct the arctangent reference angle."],"reject":["tan inverse y/x automatically returns the correct full-circle quadrant."]},{"id":"task1_v171_006","subject":"Maths","section":"Trigonometry degrees and identities","front":"In which quadrants is sin θ positive?","originalBack":"Quadrants I and II.","accept":["Sine is positive in quadrants one and two."],"reject":["Sin theta is positive in quadrants three and four."]},{"id":"math_logs_power","subject":"Maths","section":"Exponentials and logarithms","front":"What is logₐ(xᵏ)?","originalBack":"k logₐx.","accept":["log base a of x to power k equals k times log base a of x."],"reject":["log_a(x^k)=log_a(x)+k."]},{"id":"math_logs_product","subject":"Maths","section":"Exponentials and logarithms","front":"What is logₐ(xy)?","originalBack":"logₐx + logₐy.","accept":["log_a(xy)=log_a(x)+log_a(y) for positive x and y."],"reject":["log_a(xy)=log_a(x) times log_a(y)."]},{"id":"task1_v162_022","subject":"Maths","section":"Differentiation and stationary points","front":"What does f′(x)>0 mean over an interval?","originalBack":"The function is increasing there.","accept":["When the first derivative is positive throughout an interval, the function increases there."],"reject":["If f'(x)>0 then f(x) must be negative throughout that interval."]},{"id":"v33_card_maths_integration_81","subject":"Maths","section":"Integration and signed area","front":"What does a definite integral of f(x) below the x-axis contribute?","originalBack":"Negative signed area, not automatically positive physical area.","accept":["A region below the x axis contributes negative signed area to a definite integral."],"reject":["A definite integral always counts area under the x-axis as positive."]},{"id":"task1_v171_010","subject":"Maths","section":"Integration and signed area","front":"For total area where a graph crosses the x-axis, what is needed?","originalBack":"Split at the roots and add the positive areas.","accept":["Split the area at x-intercepts, taking absolute values of each signed integral."],"reject":["Find total area by adding the raw signed integrals even if some are negative."]},{"id":"task1_v162_023","subject":"Maths","section":"Vectors collinearity and division","front":"How do position vectors give the vector from A to B?","originalBack":"AB = OB − OA (position vectors).","accept":["Vector AB is position vector OB minus position vector OA."],"reject":["AB=OA-OB for all points A and B."]},{"id":"task1_v171_003","subject":"Maths","section":"Vectors collinearity and division","front":"How do you add 2D vectors (a,b) and (c,d)?","originalBack":"(a+c, b+d).","accept":["Add corresponding vector components, giving (a+c,b+d)."],"reject":["The sum is (ac,bd) by multiplying the components."]},{"id":"task1_v171_004","subject":"Maths","section":"Vectors collinearity and division","front":"What is k times the vector (a,b)?","originalBack":"(ka, kb).","accept":["Scalar k multiplies both components, giving (ka,kb)."],"reject":["k(a,b)=(a+k,b+k)."]}];
function applyV324CoreRecallCalibration(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V324_REVIEWED_CORE_VARIANTS){
  const card=byId.get(row.id);
  if(!card||card.subject!==row.subject||card.front!==row.front||card.back!==row.originalBack)continue;
  if(row.revisedBack){
   card.back=row.revisedBack;
   card.accept=(card.accept||[]).filter(ans=>ans!==row.originalBack);
  }
  card.accept=[...new Set([card.back,...(card.accept||[]),...row.accept])];
  card.reject=[...new Set([...(card.reject||[]),...(row.revisedBack?[row.originalBack]:[]),...row.reject])];
  card.v324ExactReviewed=true;
 }
 return existing;
}

// v326: five original compound recall prompts rewritten as short single-task cards.
const V326_REWRITTEN_ORIGINAL_CORE=[{"id":"phy_fbd_common_forces","subject":"Physics","originalFront":"What common forces might appear on a free-body diagram?","originalBack":"Weight acts vertically down; normal contact force acts perpendicular to a surface; tension acts along a string; drag/friction acts opposite relative motion or its tendency.","newFront":"Fill: weight acts ___; normal acts ___; tension acts ___; friction acts ___.","newBack":"vertically down; perpendicular to surface; along string; opposes relative motion","accept":["downwards; perpendicular; along the rope; opposes relative sliding","down; normal to surface; along the string; opposes slipping"],"reject":["weight up; normal vertical; tension sideways; friction always downhill","down; parallel to surface; perpendicular to string; along slipping direction","down; perpendicular; along rope; opposite direction of motion"],"method":"fill gaps","clozeParts":[["vertically down","down","downwards","vertically downwards"],["perpendicular to surface","normal to surface","perpendicular","at right angles to surface"],["along string","along the string","along rope","along cord"],["opposes relative motion","opposes relative movement","opposes relative sliding","opposes sliding","opposes slipping","against relative slipping","against slipping","opposite to relative sliding"]]},{"id":"phy_couple_001","subject":"Physics","originalFront":"What is a couple, and what is the moment of a couple?","originalBack":"Two equal, opposite, parallel forces with separated lines of action. Resultant force = 0. Moment of the couple = Fd, where d is the perpendicular separation.","newFront":"What is a couple of forces?","newBack":"Two equal, opposite, parallel forces acting along different lines of action.","accept":["Two equal opposite parallel forces with separated lines of action.","An equal and opposite pair of parallel forces, offset from each other."],"reject":["Two equal and opposite forces acting along the same line.","Two unbalanced forces producing a net force instead of a pure turning effect."]},{"id":"phy_focus_v38_07","subject":"Physics","originalFront":"State Newton's third law and explain why the two forces do not cancel.","originalBack":"Interacting objects exert equal, opposite forces of the same type on each other, acting on different objects, so they do not cancel on one object.","newFront":"Why don't Newton's third-law forces cancel on one object?","newBack":"They act on different interacting objects, not on the same object.","accept":["The action and reaction forces act on separate bodies.","Each third-law force is exerted on a different object."],"reject":["They act on the same object and therefore cancel.","Newton's third-law pair always add to give a larger force on one body."]},{"id":"phy_mechanics_focus_v37_03","subject":"Physics","originalFront":"Velocity changes from −8 to −2 m s⁻¹ in 3.0 s. Find acceleration and describe the speed.","originalBack":"a = (−2 − (−8))/3 = +2.0 m s⁻². Speed falls from 8 to 2 m s⁻¹.","newFront":"Velocity changes from −8 to −2 m s⁻¹ in 3.0 s. Find acceleration.","newBack":"+2.0 m s⁻².","accept":["+2 metres per second squared","+2.0 m/s^2"],"reject":["−2.0 m s⁻².","+6.0 m s⁻²."]},{"id":"task1_v142_011","subject":"Chemistry","originalFront":"What catalyst is associated with catalytic cracking and what products are valuable?","originalBack":"A zeolite catalyst; valuable products include motor fuels and aromatic hydrocarbons.","newFront":"Which catalyst is used for catalytic cracking?","newBack":"A zeolite catalyst.","accept":["Zeolite","A zeolite, an acidic aluminosilicate catalyst."],"reject":["Concentrated sulfuric acid is the catalytic cracking catalyst.","Platinum is the standard zeolite cracking catalyst."]}];
function applyV326CoreClarityFixes(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V326_REWRITTEN_ORIGINAL_CORE){
  const card=byId.get(row.id);
  if(!card||card.subject!==row.subject||card.front!==row.originalFront||card.back!==row.originalBack)continue;
  card.front=row.newFront;
  card.back=row.newBack;
  card.accept=[...new Set([row.newBack,row.originalBack,...(card.accept||[]),...row.accept])];
  card.reject=[...new Set([...(card.reject||[]),...row.reject])];
  card.strictRecall=true;
  if(row.method==='fill gaps'){
   card.method='fill gaps';
   card.clozeParts=row.clozeParts;
  }
  card.v326ExactReviewed=true;
 }
 return existing;
}

// v327: 60 more fact-checked first-mock original core cards, selected after v324 and v326.
const V327_REVIEWED_CORE_VARIANTS=[{"id":"phy_mechanics_focus_v37_33","subject":"Physics","section":"Measurement errors and uncertainty","front":"Why does percentage uncertainty in wire diameter approximately double for cross-sectional area?","originalBack":"Area A = πd²/4, so percentage uncertainty in A ≈ 2 × percentage uncertainty in d.","accept":["Area varies as diameter squared, so the percentage area uncertainty is twice the percentage diameter uncertainty."],"reject":["The percentage uncertainty in area is half the percentage uncertainty in wire diameter."]},{"id":"phy_prac_uncert","subject":"Physics","section":"Measurement errors and uncertainty","front":"Why does increasing the measured interval often reduce percentage uncertainty?","originalBack":"The absolute uncertainty is similar but becomes a smaller fraction of a larger measured value.","accept":["A larger measured interval has a smaller relative uncertainty for the same absolute reading error."],"reject":["Percentage uncertainty increases automatically whenever the measured interval increases."]},{"id":"phy_mechanics_focus_v37_11","subject":"Physics","section":"Resolving vectors and forces","front":"A 12 N force is 30° from the vertical. Find its horizontal and vertical components.","originalBack":"Horizontal = 12 sin30° = 6.0 N; vertical = 12 cos30° ≈ 10.4 N.","accept":["Horizontal 6.0 N and vertical approximately 10.4 N."],"reject":["Horizontal 10.4 N and vertical 6.0 N."]},{"id":"phy_graph_weakness_v36_v_zero_crossing","subject":"Physics","section":"Motion and its graphs","front":"What does crossing the time axis on a velocity–time graph mean?","originalBack":"Velocity passes through zero and changes sign: the object stops momentarily, then reverses direction.","accept":["A sign change in velocity means the object is briefly at rest then travels in the opposite direction."],"reject":["Crossing zero velocity proves that acceleration is zero at that instant."]},{"id":"phy_mechanics_focus_v37_01","subject":"Physics","section":"Motion and its graphs","front":"A displacement–time curve has a positive gradient which becomes less steep. What happens to velocity?","originalBack":"Velocity remains positive but decreases: the object moves forwards while slowing down.","accept":["Its gradient stays positive but falls, so velocity is positive and decreasing."],"reject":["A less steep positive displacement-time gradient means negative velocity."]},{"id":"phy_mechanics_focus_v37_02","subject":"Physics","section":"Motion and its graphs","front":"What does a horizontal velocity–time graph below the time axis show?","originalBack":"Constant negative velocity; acceleration is zero. The object is moving, not stationary.","accept":["The object moves with an unchanging velocity in the negative direction and zero acceleration."],"reject":["A flat velocity-time line below zero indicates zero velocity and no motion."]},{"id":"task1_v124_bulk_phy_065","subject":"Physics","section":"Forces and slopes","front":"How does the normal reaction change on an incline without other perpendicular forces?","originalBack":"R = mg cos θ.","accept":["On an incline of angle theta with no other perpendicular components, the contact force is mg cos theta."],"reject":["The normal reaction on a slope always equals mg sin theta."]},{"id":"task1_v124_bulk_phy_066","subject":"Physics","section":"Forces and slopes","front":"What is the weight component down a slope of angle θ?","originalBack":"mg sin θ.","accept":["Down-slope component of weight is mg sin(theta)."],"reject":["The weight component parallel to the slope is mg cos theta."]},{"id":"phy_mechanics_focus_v37_15","subject":"Physics","section":"Moments and couples","front":"A 20 N force acts at 30° to a 0.50 m lever arm. Find its moment about the pivot.","originalBack":"M = Fr sinθ = 20×0.50×sin30° = 5.0 N m.","accept":["5.0 newton metres, from 20 times 0.50 times sin 30 degrees."],"reject":["10.0 N m, because the sine factor can be omitted."]},{"id":"phy_moment_eq","subject":"Physics","section":"Moments and couples","front":"What is the principle of moments in equilibrium?","originalBack":"Total clockwise moment = total anticlockwise moment about the same point.","accept":["For rotational equilibrium the sum of moments clockwise equals the sum anticlockwise about one pivot."],"reject":["For equilibrium clockwise moments must exceed anticlockwise moments."]},{"id":"task1_phy_078","subject":"Physics","section":"Momentum and impulse","front":"What condition allows use of conservation of momentum?","originalBack":"No external resultant force acts on the system.","accept":["Momentum of a system is conserved if the net external force on that system is zero."],"reject":["Momentum is conserved only when every object has zero velocity."]},{"id":"phy_power_elec","subject":"Physics","section":"Energy power efficiency","front":"Give three electrical power equations.","originalBack":"P = VI = I²R = V²/R.","accept":["Power equals voltage times current, current squared times resistance, or voltage squared divided by resistance."],"reject":["P=V/I=IR=V/R for an electrical component."]},{"id":"task1_phy_087","subject":"Physics","section":"Materials stress strain Young modulus","front":"What is the ultimate tensile stress?","originalBack":"Maximum tensile stress before breaking.","accept":["Ultimate tensile stress is the greatest stress attained in a tensile test."],"reject":["Ultimate tensile stress is the strain at which a material first begins to deform."]},{"id":"phy_strain","subject":"Physics","section":"Materials stress strain Young modulus","front":"What is tensile strain?","originalBack":"strain = ΔL/L; it has no unit.","accept":["The extension divided by original length, with no dimensions."],"reject":["Strain equals applied force divided by cross-sectional area in pascals."]},{"id":"task1_phy_035","subject":"Physics","section":"Progressive waves and phase","front":"What is wavelength?","originalBack":"Shortest distance between two points in phase.","accept":["Wavelength is the shortest separation of two positions vibrating in phase on a progressive wave."],"reject":["Wavelength is the distance travelled by a wave in half a period."]},{"id":"task1_phy_048","subject":"Physics","section":"Progressive waves and phase","front":"For a string fixed at both ends, what is the first-harmonic wavelength?","originalBack":"Twice the vibrating length, λ = 2L.","accept":["The first harmonic on a string fixed at both ends has wavelength 2 times the length."],"reject":["For a string with fixed ends the fundamental wavelength equals the string length."]},{"id":"task1_phy_055","subject":"Physics","section":"Diffraction interference and gratings","front":"What happens to fringe spacing if the double-slit separation increases?","originalBack":"It decreases.","accept":["Larger slit spacing means smaller fringe spacing, with all else unchanged."],"reject":["Increasing double-slit separation increases fringe spacing."]},{"id":"task1_phy_056","subject":"Physics","section":"Diffraction interference and gratings","front":"What happens to fringe spacing if the screen distance increases?","originalBack":"It increases.","accept":["Fringe spacing scales directly with the distance from slits to screen."],"reject":["Moving the screen farther from the slits makes fringe spacing smaller."]},{"id":"task1_phy_065","subject":"Physics","section":"Refraction and optical fibres","front":"What is the critical-angle equation for air outside a material?","originalBack":"sin c = 1/n.","accept":["For a material surrounded by air, the critical angle obeys sin c=1/n."],"reject":["At an air interface the critical-angle rule is sin c=n."]},{"id":"task1_practical_011","subject":"Physics","section":"Electricity and potential dividers","front":"What does the gradient of resistance against wire length give?","originalBack":"ρ/A, for a wire of constant cross-section.","accept":["The R against L slope equals resistivity divided by cross-sectional area."],"reject":["The resistance-length gradient is the resistivity times cross-sectional area."]},{"id":"chem_atomic_v43_06","subject":"Chemistry","section":"Atomic structure isotopes mass spectra","front":"How many electrons are in a 3+ ion formed from Z=13?","originalBack":"13−3 = 10 electrons; the nucleus is unchanged.","accept":["An aluminium ion with charge 3+ and Z=13 contains ten electrons."],"reject":["A 3+ ion with proton number 13 has 16 electrons."]},{"id":"chem_atomic_v43_15","subject":"Chemistry","section":"Atomic structure isotopes mass spectra","front":"What is the purpose of ionisation in TOF?","originalBack":"To give sample particles an electrical charge so they can be accelerated and detected.","accept":["TOF ionisation makes charged ions that electric fields can accelerate and a detector can register."],"reject":["Ionisation in TOF gives every atom the same mass and removes isotope differences."]},{"id":"chem_atomic_v43_40","subject":"Chemistry","section":"Electron configuration and ionisation","front":"Write the second ionisation equation for magnesium.","originalBack":"Mg⁺(g) → Mg²⁺(g) + e⁻.","accept":["Mg+(g) to Mg2+(g) plus an electron."],"reject":["Mg(g) -> Mg+(g) + e- is the second ionisation equation."]},{"id":"chem_atomic_v43_47","subject":"Chemistry","section":"Electron configuration and ionisation","front":"How many electrons can an s, p and d subshell hold?","originalBack":"s: 2; p: 6; d: 10.","accept":["The subshell electron capacities are s 2, p 6, d 10."],"reject":["The electron capacities of s, p and d are 2, 8 and 18."]},{"id":"chem_amount_v44_01","subject":"Chemistry","section":"Amount calculations and titration","front":"What is the difference between empirical and molecular formula?","originalBack":"Empirical: simplest atom ratio. Molecular: actual atoms per molecule.","accept":["Empirical gives the lowest whole-number atom ratio; molecular gives actual atoms in one molecule."],"reject":["An empirical formula always has more atoms than the molecular formula."]},{"id":"chem_amount_v44_03","subject":"Chemistry","section":"Amount calculations and titration","front":"What are the three stages of empirical formula calculation?","originalBack":"Divide element masses by Ar; divide moles by smallest; find integer ratio.","accept":["Convert each mass to moles, divide by the least, then scale to whole numbers."],"reject":["To find empirical formula, divide each mass by the largest atomic number and stop."]},{"id":"chem_amount_v44_05","subject":"Chemistry","section":"Amount calculations and titration","front":"How is molecular formula calculated from empirical formula?","originalBack":"Find empirical-formula Mr, divide molecular Mr by it, multiply subscripts.","accept":["Divide measured molecular Mr by empirical-formula mass, then multiply empirical subscripts by that integer."],"reject":["Molecular formula is found by dividing each empirical subscript by the molecular Mr."]},{"id":"chem_amount_v44_11","subject":"Chemistry","section":"Amount calculations and titration","front":"How do you calculate molar mass of an unknown gas from mass and gas data?","originalBack":"First n=pV/(RT), then molar mass M=m/n.","accept":["Obtain moles from pV= nRT and divide measured gas mass by n."],"reject":["The molar mass of a gas equals its pressure divided by its volume."]},{"id":"chem_bonding_v47_10","subject":"Chemistry","section":"Shapes covalent and ionic bonding","front":"Define a single covalent bond accurately.","originalBack":"One electron pair shared between atoms and attracted to both nuclei.","accept":["A covalent bond is the attraction of two nuclei for one shared pair of electrons."],"reject":["A single covalent bond is attraction between two oppositely charged ions."]},{"id":"chem_bonding_v47_12","subject":"Chemistry","section":"Shapes covalent and ionic bonding","front":"What is a coordinate or dative covalent bond?","originalBack":"A shared pair where both electrons originate from one atom.","accept":["Both electrons in a dative shared pair are supplied by one donor atom."],"reject":["A coordinate bond forms when each atom supplies one electron to the pair."]},{"id":"chem_bonding_v47_27","subject":"Chemistry","section":"Intermolecular forces and structure","front":"How many covalent bonds does each carbon make in diamond?","originalBack":"Four, in a three-dimensional tetrahedral network.","accept":["In diamond every carbon makes four strong covalent bonds in a tetrahedral network."],"reject":["In diamond every carbon atom forms three bonds and has one delocalised electron."]},{"id":"chem_bonding_v47_29","subject":"Chemistry","section":"Intermolecular forces and structure","front":"Why does diamond not conduct electricity?","originalBack":"No mobile ions or delocalised electrons are available.","accept":["Diamond has no mobile charge carriers, because its valence electrons are localised in bonds."],"reject":["Diamond conducts because each carbon has a mobile delocalised electron."]},{"id":"chem_bh_defs_20261024_hydration_def","subject":"Chemistry","section":"Calorimetry and enthalpy","front":"Define enthalpy of hydration.","originalBack":"The enthalpy change when 1 mole of gaseous ions becomes hydrated, forming aqueous ions.","accept":["Hydration enthalpy is the change when one mole of gaseous ions becomes aqueous ions."],"reject":["Hydration enthalpy is the change for aqueous ions becoming isolated gaseous ions."]},{"id":"chem_bh_defs_20261024_latt_formation_def","subject":"Chemistry","section":"Calorimetry and enthalpy","front":"Define lattice enthalpy of formation.","originalBack":"The enthalpy change when 1 mole of a solid ionic compound is formed from its constituent gaseous ions.","accept":["One mole of solid ionic lattice is formed from its separate gaseous ions."],"reject":["Lattice formation enthalpy is the change on splitting a solid into gaseous ions."]},{"id":"chem_bh_defs_20261024_solution_def","subject":"Chemistry","section":"Calorimetry and enthalpy","front":"Define enthalpy of solution.","originalBack":"The enthalpy change when 1 mole of solute dissolves in enough solvent to form an infinitely dilute solution.","accept":["One mole of solute dissolves in sufficient solvent for effectively infinite dilution."],"reject":["Enthalpy of solution means forming a solid from its free gaseous ions."]},{"id":"chem_bh_defs_20261024_standard_formation_def","subject":"Chemistry","section":"Calorimetry and enthalpy","front":"Define standard enthalpy of formation.","originalBack":"The enthalpy change when 1 mole of compound forms from its constituent elements in their standard states under standard conditions.","accept":["One mole of compound is made from its elements in standard states under standard conditions."],"reject":["Standard enthalpy of formation is defined for forming two moles of compound from gaseous atoms."]},{"id":"chem_energetics_v49_38","subject":"Chemistry","section":"Hess cycles and bond enthalpy","front":"State Hess's law.","originalBack":"Overall enthalpy change is independent of pathway if start/end states match.","accept":["The same reactants and products have the same enthalpy difference irrespective of reaction pathway."],"reject":["Hess's law says activation energy is independent of the route taken."]},{"id":"chem_energetics_v49_40","subject":"Chemistry","section":"Hess cycles and bond enthalpy","front":"What is the combustion-enthalpy Hess calculation?","originalBack":"Sum combustion enthalpies of reactants minus those of products.","accept":["Use the total combustion enthalpy of reactants minus that of products, accounting for coefficients."],"reject":["For combustion enthalpy cycles always subtract reactants from products."]},{"id":"chem_energetics_v49_41","subject":"Chemistry","section":"Hess cycles and bond enthalpy","front":"Why do equation coefficients matter in Hess calculations?","originalBack":"Multiply each substance's molar enthalpy by its stoichiometric coefficient.","accept":["Enthalpies in a Hess cycle are multiplied by the balanced equation's coefficients."],"reject":["Hess enthalpy totals should ignore coefficients in the equation."]},{"id":"task1_chem_083","subject":"Chemistry","section":"Group 2 and group 7","front":"What is the trend in Group 2 hydroxide solubility?","originalBack":"Solubility increases down the group.","accept":["Group 2 metal hydroxides generally dissolve more readily as you go down the group."],"reject":["Group 2 hydroxides become less soluble going from magnesium to barium."]},{"id":"chem_amount_v44_24","subject":"Chemistry","section":"Inorganic tests and observations","front":"Write the net ionic equation for barium sulfate precipitation.","originalBack":"Ba²⁺(aq)+SO₄²⁻(aq)→BaSO₄(s).","accept":["Ba2+(aq) plus SO4 2-(aq) produces BaSO4(s)."],"reject":["Ba2+(aq) + Cl-(aq) -> BaCl(s) is the sulfate precipitation equation."]},{"id":"chem_rates_001","subject":"Chemistry","section":"Rates and initial rates","front":"What does the overall order of a rate equation mean?","originalBack":"It is the sum of the powers of all concentration terms in the experimentally determined rate equation.","accept":["Overall reaction order is obtained by adding the exponents of the concentration terms."],"reject":["Overall order is the number of compounds appearing in a balanced chemical equation."]},{"id":"chem_arrhenius_002","subject":"Chemistry","section":"Arrhenius activation energy","front":"How do you calculate Ea from the gradient of ln k against 1/T?","originalBack":"Ea = −gradient × R. Convert J mol⁻¹ to kJ mol⁻¹ at the end if required.","accept":["Multiply the negative slope of ln k against inverse kelvin temperature by the gas constant R."],"reject":["Activation energy equals the Arrhenius graph gradient divided by R."]},{"id":"chem_kp_001","subject":"Chemistry","section":"Kp gaseous equilibrium","front":"What goes into a Kp expression?","originalBack":"Partial pressures of gaseous equilibrium species, each raised to its stoichiometric coefficient.","accept":["Use equilibrium partial pressures, products over reactants, with the powers given by stoichiometric coefficients."],"reject":["Use only the concentrations of solids in a Kp expression."]},{"id":"chem_bh_defs_20261024_second_ea_def","subject":"Chemistry","section":"Born Haber and lattice enthalpy","front":"Define second electron affinity.","originalBack":"The enthalpy change when 1 mole of gaseous 1− ions each gains an electron, forming gaseous 2− ions.","accept":["The change for one mole of gaseous singly negative ions each gaining another electron to form 2- ions."],"reject":["Second electron affinity is removal of one mole of electrons from gaseous 1- ions."]},{"id":"chem_entropy_gibbs_recap_20261024_negative_not_fast","subject":"Chemistry","section":"Entropy and Gibbs free energy","front":"Why does negative ΔG not guarantee a rapid reaction?","originalBack":"ΔG predicts thermodynamic feasibility, not rate. A high activation energy can make the reaction very slow.","accept":["A spontaneous-feasible reaction may still proceed slowly when activation energy is high."],"reject":["Negative Gibbs free-energy change guarantees an instantaneous reaction."]},{"id":"task1_chem_183","subject":"Chemistry","section":"Strong weak acids pH Ka Kw","front":"At 25 °C, what is Kw?","originalBack":"1.0 × 10⁻¹⁴ mol² dm⁻⁶.","accept":["At 298 K, Kw is 1.0 x 10^-14 mol^2 dm^-6."],"reject":["At 25 degrees Celsius Kw is 1.0 x 10^-7 mol^2 dm^-6."]},{"id":"chem_optical","subject":"Chemistry","section":"Optical isomerism and chirality","front":"What causes optical isomerism?","originalBack":"A chiral carbon bonded to four different groups gives non-superimposable mirror-image enantiomers.","accept":["A stereogenic carbon with four different groups can generate nonsuperimposable mirror-image structures."],"reject":["Optical isomerism occurs whenever a carbon atom has two identical substituents."]},{"id":"chem_amount_v44_39","subject":"Chemistry","section":"Chemistry required practical accuracy","front":"Why can distilled water be added to the conical flask during a titration?","originalBack":"It changes concentration but not the number of moles being titrated.","accept":["Water added to the conical flask does not change the number of analyte moles already transferred."],"reject":["Adding distilled water into the titration flask creates extra moles of analyte."]},{"id":"task1_maths_008","subject":"Maths","section":"Functions inequalities transformations","front":"What is the range of a function?","originalBack":"Its possible output values.","accept":["Range refers to the collection of outputs a function can take."],"reject":["The range of a function is its allowed input values."]},{"id":"task1_v124_bulk_math_002","subject":"Maths","section":"Functions inequalities transformations","front":"What is the domain of f(x) = √x over the real numbers?","originalBack":"x ≥ 0.","accept":["x must be greater than or equal to zero for real square root x."],"reject":["The real domain of square root x is all negative real numbers."]},{"id":"task1_v124_bulk_math_003","subject":"Maths","section":"Functions inequalities transformations","front":"What is the domain of f(x) = 1/(x−2)?","originalBack":"All real x except x = 2.","accept":["All real numbers other than 2, where the denominator vanishes."],"reject":["x=2 is included in the domain of 1/(x-2)."]},{"id":"v33_card_maths_coordinate_geometry_86","subject":"Maths","section":"Coordinate geometry and circles","front":"How are gradients of two nonvertical perpendicular lines related?","originalBack":"Their gradients multiply to −1.","accept":["For two nonvertical perpendicular lines, m1*m2=-1."],"reject":["Two nonvertical perpendicular lines have gradients whose product is +1."]},{"id":"math_line_gradient","subject":"Maths","section":"Coordinate geometry and circles","front":"What is the gradient between (x₁,y₁) and (x₂,y₂)?","originalBack":"m=(y₂−y₁)/(x₂−x₁).","accept":["Change in y divided by change in x: (y2-y1)/(x2-x1)."],"reject":["Gradient equals (x2-x1)/(y2-y1) in general."]},{"id":"task1_v162_013","subject":"Maths","section":"Coordinate geometry and circles","front":"What is true of the gradients of two non-vertical parallel lines?","originalBack":"They are equal.","accept":["Parallel nonvertical straight lines have the same slope."],"reject":["Parallel straight lines always have gradient product -1."]},{"id":"task1_v171_007","subject":"Maths","section":"Trigonometry degrees and identities","front":"At which angles in degrees is tan θ undefined?","originalBack":"90° + 180°n, for any integer n.","accept":["90 degrees plus an integer multiple of 180 degrees."],"reject":["tan theta is undefined at all multiples of 180 degrees."]},{"id":"task1_v136_004","subject":"Maths","section":"Exponentials and logarithms","front":"What is logₐ1?","originalBack":"0, since a⁰ = 1 (a > 0, a ≠ 1).","accept":["The logarithm to any valid base of 1 is 0."],"reject":["log_a(1)=1 for a>0 and a not equal to 1."]},{"id":"task1_v136_005","subject":"Maths","section":"Exponentials and logarithms","front":"What is logₐa?","originalBack":"1, for a > 0 and a ≠ 1.","accept":["The logarithm of its own valid base equals one."],"reject":["log_a(a)=0 for any valid base a."]},{"id":"task1_v138_001","subject":"Maths","section":"Exponentials and logarithms","front":"State the logarithm quotient law for logₐ(x/y).","originalBack":"logₐ(x/y) = logₐx − logₐy (x,y>0; a>0, a≠1).","accept":["The log of a quotient is the log of numerator minus the log of denominator."],"reject":["log_a(x/y)=log_a(x)+log_a(y)."]},{"id":"v33_card_maths_integration_80","subject":"Maths","section":"Integration and signed area","front":"Why is +C needed in an indefinite integral?","originalBack":"Differentiation removes constant terms, so every constant shift is an antiderivative.","accept":["All antiderivatives differ by an arbitrary additive constant that disappears on differentiation."],"reject":["An indefinite integral has no arbitrary constant because differentiation preserves constants."]}];
function applyV327CoreRecallCalibration(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V327_REVIEWED_CORE_VARIANTS){
  const card=byId.get(row.id);
  if(!card||card.subject!==row.subject||card.front!==row.front||card.back!==row.originalBack)continue;
  card.accept=[...new Set([card.back,...(card.accept||[]),...row.accept])];
  card.reject=[...new Set([...(card.reject||[]),...row.reject])];
  card.v327ExactReviewed=true;
 }
 return existing;
}

// v328: exactly matched source-core science recall cards, including a precise phase definition.
const V328_REVIEWED_SCIENCE_CORE=[{"subject":"Physics","id":"phy_mechanics_weakness_v35_couple_turn","section":"Resolving vectors and forces","originalFront":"Why can a couple turn an object without a resultant force?","originalBack":"Its two equal, opposite, parallel forces cancel as forces, but act along separate lines to cause turning.","accept":["A couple has zero net force because the two forces oppose, but its separated force lines create a turning moment."],"reject":["A couple produces rotation because its resultant force is nonzero."]},{"subject":"Physics","id":"phy_resolve_weakness_20261025_horizontal_30","section":"Resolving vectors and forces","originalFront":"50 N at 30° above horizontal: find horizontal and vertical components.","originalBack":"Horizontal = 50 cos 30° = 43.3 N; vertical = 50 sin 30° = 25.0 N.","accept":["For 50 N at 30 degrees above horizontal, horizontal=43.3 N and vertical=25 N."],"reject":["The horizontal component is 25 N and the vertical component 43.3 N."]},{"subject":"Physics","id":"phy_resolve_weakness_20261025_vertical_30","section":"Resolving vectors and forces","originalFront":"50 N at 30° to vertical: find horizontal and vertical components.","originalBack":"Horizontal = 50 sin 30° = 25.0 N; vertical = 50 cos 30° = 43.3 N.","accept":["At 30 degrees to vertical, horizontal=25 N and vertical=43.3 N for a 50 N force."],"reject":["A force 30 degrees to vertical has horizontal=43.3 N and vertical=25 N."]},{"subject":"Physics","id":"phy_graph_weakness_v36_compare_slope_vs_area","section":"Motion and its graphs","originalFront":"In motion graphs, what do a gradient and a signed area each represent?","originalBack":"s–t gradient → v; v–t gradient → a, area → Δs; a–t area → Δv.","accept":["s-t slope=v; v-t slope=a and signed area=displacement; a-t signed area=change in velocity."],"reject":["Area under a displacement-time graph gives acceleration, and slope of a velocity-time graph gives distance."]},{"subject":"Physics","id":"phy_mechanics_focus_v37_12","section":"Forces and slopes","originalFront":"A 2.0 kg object accelerates at 3.0 m s⁻². Friction is 4.0 N opposite the pull. Find the pull.","originalBack":"Resultant force = ma = 6.0 N; pulling force = 6.0+4.0 = 10.0 N.","accept":["The resultant must be 2.0 times 3.0=6 N, so applied pull is 6+4=10 N."],"reject":["The pulling force is only 2 N because the frictional force must be subtracted from ma."]},{"subject":"Physics","id":"task1_v125_007","section":"Forces and slopes","originalFront":"Does the normal reaction always equal an object's weight?","originalBack":"No, only in certain force balances.","accept":["No: on an incline it is mg cos theta when no extra perpendicular forces act."],"reject":["The normal reaction always equals mg, regardless of slope or other forces."]},{"subject":"Physics","id":"task1_phy_075","section":"Projectile motion","originalFront":"What stays constant horizontally in ideal projectile motion?","originalBack":"Velocity; horizontal acceleration is zero.","accept":["The horizontal component of velocity stays the same without drag."],"reject":["Horizontal velocity decreases uniformly because gravity acts downwards."]},{"subject":"Physics","id":"task1_phy_076","section":"Projectile motion","originalFront":"What is the vertical acceleration during ideal projectile motion?","originalBack":"g downward.","accept":["Acceleration is g towards the ground at all points, including the highest point."],"reject":["Vertical acceleration is zero at the highest point of the projectile."]},{"subject":"Physics","id":"task1_v125_025","section":"Projectile motion","originalFront":"Ignoring air resistance, what is the horizontal acceleration of a projectile?","originalBack":"Zero.","accept":["The projectile has no horizontal acceleration when drag is neglected."],"reject":["Horizontal acceleration equals 9.81 m/s squared."]},{"subject":"Physics","id":"phy_mechanics_focus_v37_16","section":"Moments and couples","originalFront":"Two equal opposite 15 N forces form a couple separated by 0.40 m. Find the moment.","originalBack":"Moment of the couple = Fd = 15×0.40 = 6.0 N m. Do not double it.","accept":["A couple moment is force times the separation, 15 times 0.4 = 6 N m."],"reject":["The moment is 12 N m because both forces must be added as moments when using full separation."]},{"subject":"Physics","id":"phy_pandr_v29_momentum_relation","section":"Moments and couples","originalFront":"How does doubling particle momentum affect de Broglie wavelength?","originalBack":"It halves the wavelength, since λ = h/p.","accept":["Since lambda=h/p, twice the momentum means half the de Broglie wavelength."],"reject":["Doubling momentum doubles the de Broglie wavelength."]},{"subject":"Physics","id":"phy_mechanics_focus_v37_20","section":"Momentum and impulse","originalFront":"In an inelastic collision of an isolated system, which quantities are conserved?","originalBack":"Total momentum is conserved; total kinetic energy need not be conserved.","accept":["In an isolated inelastic collision momentum is conserved, but kinetic energy generally is not."],"reject":["In any inelastic collision both total momentum and total kinetic energy must stay constant."]},{"subject":"Physics","id":"task1_phy_077","section":"Momentum and impulse","originalFront":"What is an impulse?","originalBack":"Change in momentum, FΔt.","accept":["Impulse is the change of momentum, equal to the area under force-time graph."],"reject":["Impulse is the same as work done and has units of joules."]},{"subject":"Physics","id":"phy_electron_diffraction_exam_q9c","section":"Momentum and impulse","originalFront":"Which equation links an electron's de Broglie wavelength λ with its momentum p?","originalBack":"λ = h/p.","accept":["de Broglie wavelength is Planck's constant divided by momentum, lambda=h/p."],"reject":["Electron wavelength equals the electron momentum multiplied by h."]},{"subject":"Physics","id":"phy_mechanics_focus_v37_22","section":"Energy power efficiency","originalFront":"A force parallel to motion rises linearly from 0 to 40 N across 2.0 m. Find work done.","originalBack":"Work = triangular area under F–s graph = ½×2.0×40 = 40 J.","accept":["Area under F-distance is a triangle: one-half times 2 times 40 = 40 J."],"reject":["The work is 80 J because the linearly increasing force must be treated as constant at 40 N."]},{"subject":"Physics","id":"phy_mechanics_focus_v37_24","section":"Energy power efficiency","originalFront":"An engine exerts a 30 N force along the direction of travel at 4.0 m s⁻¹. Find power.","originalBack":"P = Fv = 30×4.0 = 120 W.","accept":["For force parallel to motion, power=force times speed=120 watts."],"reject":["Power is 7.5 W from dividing force by speed."]},{"subject":"Physics","id":"phy_mechanics_focus_v37_29","section":"Materials stress strain Young modulus","originalFront":"For a stress–strain graph, when does the gradient give Young modulus?","originalBack":"In the straight-line elastic region: E = Δstress/Δstrain.","accept":["Young modulus is stress-strain slope only over the linear elastic portion."],"reject":["The stress-strain gradient is Young modulus throughout all plastic deformation."]},{"subject":"Physics","id":"phy_stress","section":"Materials stress strain Young modulus","originalFront":"What is tensile stress?","originalBack":"stress = F/A, in Pa.","accept":["Tensile stress is applied tensile force per cross-sectional area, in pascals."],"reject":["Tensile stress is extension divided by original length and has no units."]},{"subject":"Physics","id":"phy_spectra_photo_v32_matching_lines","section":"Progressive waves and phase","originalFront":"Why can an element's absorption and emission lines have matching wavelengths?","originalBack":"The same energy gaps are involved in upward and downward electron transitions.","accept":["Absorption and emission can involve the same pair of electron levels, giving equal photon energy gaps."],"reject":["Absorption and emission lines of an element are unrelated because transitions never share energy levels."]},{"subject":"Physics","id":"task1_phy_036","section":"Progressive waves and phase","originalFront":"What is phase difference?","originalBack":"The difference in position within an oscillation cycle.","revisedBack":"The difference in phase angle between two oscillations or points on a wave, measured in radians or degrees.","accept":["The angular phase offset between two oscillations, measured in radians or degrees."],"reject":["Phase difference is the physical distance between two objects irrespective of wavelength."]},{"subject":"Physics","id":"phy_pandr_v29_rings_acceleration","section":"Diffraction interference and gratings","originalFront":"Why do electron diffraction rings shrink as accelerating voltage rises?","originalBack":"Electrons gain momentum, λ = h/p falls, and diffraction angles decrease.","accept":["More accelerating voltage gives electrons greater momentum and shorter wavelength, reducing diffraction angle."],"reject":["Higher accelerating voltage increases electron de Broglie wavelength and ring radius."]},{"subject":"Physics","id":"task1_phy_057","section":"Diffraction interference and gratings","originalFront":"Why is the central white-light double-slit fringe white?","originalBack":"All wavelengths have zero path difference there.","accept":["Every wavelength has zero path difference on the centre line, so the superposed light is white."],"reject":["The central fringe is white because only red light reaches the centre."]},{"subject":"Physics","id":"task1_phy_046","section":"Stationary waves and harmonics","originalFront":"How do stationary waves form?","originalBack":"Two coherent waves travel in opposite directions and superpose.","accept":["Two coherent waves of equal frequency travelling in opposite directions interfere to give fixed nodes and antinodes."],"reject":["Stationary waves arise when two waves travel in the same direction at different frequencies."]},{"subject":"Physics","id":"task1_practical_001","section":"Stationary waves and harmonics","originalFront":"In string-wave RP1, what controls the fundamental frequency?","originalBack":"Vibrating length, tension and mass per unit length.","accept":["For a fixed-end string, fundamental frequency depends on vibrating length, tension and mass per unit length."],"reject":["Only the driving amplitude controls a fixed string's fundamental frequency."]},{"subject":"Physics","id":"task1_practical_002","section":"Stationary waves and harmonics","originalFront":"What relation can be tested by plotting f² against tension?","originalBack":"A straight line at fixed length and mass per unit length.","accept":["At fixed length and linear density, f squared is directly proportional to tension."],"reject":["A plot of f squared against tension must be inverse because greater tension lowers frequency."]},{"subject":"Physics","id":"task1_phy_061","section":"Refraction and optical fibres","originalFront":"What is refractive index?","originalBack":"n = c/v for light in the medium.","accept":["Refractive index is speed in vacuum divided by speed in the medium."],"reject":["Refractive index is medium light speed divided by c."]},{"subject":"Physics","id":"task1_phy_063","section":"Refraction and optical fibres","originalFront":"What happens to light wavelength on entering a higher-index medium?","originalBack":"It decreases.","accept":["Light frequency stays constant, so lower speed in a higher-index medium means shorter wavelength."],"reject":["The frequency must increase to explain the shorter wavelength in glass."]},{"subject":"Physics","id":"phy_pandr_v29_kef_gradient","section":"Photoelectric effect","originalFront":"What is the gradient of a graph of maximum photoelectron KE against frequency?","originalBack":"Planck constant, h.","accept":["The slope of maximum kinetic energy versus incident light frequency is h."],"reject":["The slope equals work function phi, with units of joules."]},{"subject":"Physics","id":"phy_baryon_meson","section":"Particles quarks and interactions","originalFront":"How do baryons and mesons differ?","originalBack":"Baryons contain three quarks; mesons contain a quark and an antiquark.","accept":["Baryons have three quarks, while mesons contain a quark and an antiquark."],"reject":["A meson is a hadron made from three quarks, while a baryon is quark-antiquark."]},{"subject":"Physics","id":"task1_practical_013","section":"Electricity and potential dividers","originalFront":"Why should current not be left flowing unnecessarily in a cell experiment?","originalBack":"Heating and changing cell conditions can alter measurements.","accept":["Leaving current flowing heats the cell and changes its conditions, distorting terminal pd/internal-resistance readings."],"reject":["A current left running cannot affect emf or terminal potential difference measurements."]},{"subject":"Chemistry","id":"chem_atomic_v43_11","section":"Atomic structure isotopes mass spectra","originalFront":"How do you calculate Ar from two isotope abundances?","originalBack":"(isotope mass₁×abundance₁ + mass₂×abundance₂) ÷ total abundance.","accept":["Multiply each isotope's mass by its fractional abundance and add the products."],"reject":["Take the simple unweighted mean of isotope masses regardless of abundances."]},{"subject":"Chemistry","id":"chem_atomic_v43_12","section":"Atomic structure isotopes mass spectra","originalFront":"Why is Ar of an isotope mixture a weighted mean?","originalBack":"More abundant isotopes contribute more to the average mass.","accept":["An isotope with higher relative abundance contributes more strongly to average atomic mass."],"reject":["Each isotope makes the same contribution regardless of its abundance."]},{"subject":"Chemistry","id":"chem_atomic_v43_16","section":"Electron configuration and ionisation","originalFront":"What is formed by electron-impact ionisation of X(g)?","originalBack":"X⁺(g), after an electron is removed.","accept":["An electron is removed to give the gaseous positive ion X+ and an electron."],"reject":["Electron-impact ionisation directly forms a negative ion X- by adding an electron."]},{"subject":"Chemistry","id":"chem_atomic_v43_41","section":"Electron configuration and ionisation","originalFront":"Why do successive ionisation energies increase?","originalBack":"Each electron is removed from an increasingly positive ion.","accept":["As each electron is removed the ion becomes more positive, increasing attraction to the remaining electrons."],"reject":["Successive ionisation energies fall because the increasingly positive ion attracts electrons less."]},{"subject":"Chemistry","id":"chem_bonding_v47_11","section":"Shapes covalent and ionic bonding","originalFront":"How many shared pairs are in a double and a triple covalent bond?","originalBack":"Two and three shared electron pairs respectively.","accept":["A double covalent bond consists of two shared electron pairs and a triple bond of three."],"reject":["A double bond shares four electron pairs and a triple shares six."]},{"subject":"Chemistry","id":"chem_bonding_v47_15","section":"Shapes covalent and ionic bonding","originalFront":"Which species donates the lone pair in NH₃→BF₃?","originalBack":"The nitrogen atom in NH₃ donates to electron-deficient boron in BF₃.","accept":["The nitrogen lone pair in NH3 forms the dative bond to boron in BF3."],"reject":["BF3 nitrogen donates a lone pair to ammonia."]},{"subject":"Chemistry","id":"chem_bonding_v47_28","section":"Intermolecular forces and structure","originalFront":"Why does diamond have an extremely high melting point?","originalBack":"Many strong covalent C–C bonds throughout the giant lattice must be broken.","accept":["Many strong covalent bonds throughout the diamond structure require substantial energy to break."],"reject":["Diamond melts at low temperature because it has only weak intermolecular forces between molecules."]},{"subject":"Chemistry","id":"chem_bonding_v47_30","section":"Intermolecular forces and structure","originalFront":"What does graphite's bonding look like?","originalBack":"Each C forms three covalent bonds in layers of hexagonal rings; one electron is delocalised.","accept":["Each carbon in graphite bonds to three others in hexagonal layers, leaving a delocalised electron."],"reject":["Graphite consists of isolated tetrahedral carbon molecules with no free electrons."]},{"subject":"Chemistry","id":"chem_bh_defs_20261024_ionic_lattice","section":"Born Haber and lattice enthalpy","originalFront":"What is an ionic lattice?","originalBack":"A giant 3D repeating arrangement of oppositely charged ions held by electrostatic attractions.","accept":["A three-dimensional regular repeating giant structure of positive and negative ions."],"reject":["An ionic lattice is a set of separate small molecules held by covalent bonds."]},{"subject":"Chemistry","id":"chem_energetics_v49_43","section":"Hess cycles and bond enthalpy","originalFront":"What happens to a Hess enthalpy when the equation is halved?","originalBack":"Halve the ΔH value.","accept":["If every stoichiometric coefficient is halved, the enthalpy change is halved too."],"reject":["Halving the reaction coefficients doubles the reaction enthalpy change."]},{"subject":"Chemistry","id":"chem_atomic_v43_46","section":"Group 2 and group 7","originalFront":"Why does first IE fall down Group 2?","originalBack":"Outer electrons are farther away and more shielded, despite a larger nuclear charge.","accept":["Greater outer-shell distance and shielding outweigh the increasing nuclear charge down Group 2."],"reject":["First ionisation energy falls down Group 2 because nuclear charge decreases down the group."]},{"subject":"Chemistry","id":"task1_chem_082","section":"Group 2 and group 7","originalFront":"What forms when a Group 2 metal reacts with water?","originalBack":"A metal hydroxide and hydrogen.","accept":["A Group 2 metal reacts with water to give a metal hydroxide and H2."],"reject":["Group 2 metals react with water to form only a metal oxide and oxygen."]},{"subject":"Chemistry","id":"task1_chem_100","section":"Inorganic tests and observations","originalFront":"What colour precipitate indicates bromide with silver ions?","originalBack":"Cream (AgBr).","accept":["Bromide gives a cream silver bromide precipitate after acidification and addition of silver nitrate."],"reject":["Bromide gives a white AgCl precipitate in the silver nitrate test."]},{"subject":"Chemistry","id":"task1_chem_101","section":"Inorganic tests and observations","originalFront":"What colour precipitate indicates iodide with silver ions?","originalBack":"Yellow (AgI).","accept":["Iodide gives a yellow AgI precipitate with acidified silver nitrate."],"reject":["Iodide produces a cream precipitate of AgBr in the silver nitrate test."]},{"subject":"Chemistry","id":"chem_rate_recap_20261024_clock","section":"Rates and initial rates","originalFront":"When may initial rate be taken as proportional to 1/time?","originalBack":"When each trial reaches the same small reaction extent at its timed endpoint.","accept":["If every trial measures the same small conversion, shorter endpoint time implies a greater initial rate."],"reject":["The inverse of time is an initial-rate measure even when different trials stop at different reaction extents."]},{"subject":"Chemistry","id":"task1_chem_166","section":"Rates and initial rates","originalFront":"What is a rate equation?","originalBack":"An experimentally determined relationship between rate and reactant concentrations.","accept":["An equation relating measured reaction rate to reactant concentrations with experimentally determined orders."],"reject":["The rate equation is obtained by reading coefficients off the balanced chemical equation."]},{"subject":"Chemistry","id":"task1_chem_170","section":"Rates and initial rates","originalFront":"What does the rate constant k depend on?","originalBack":"Temperature, and any catalyst present.","accept":["The rate constant depends on temperature and whether a catalyst is present."],"reject":["At fixed temperature and catalyst, k changes whenever a reactant concentration changes."]},{"subject":"Chemistry","id":"chem_energetics_v49_06","section":"Arrhenius activation energy","originalFront":"Does an exothermic reaction necessarily have zero activation energy?","originalBack":"No; activation energy is a barrier, not the reaction's enthalpy change.","accept":["Exothermic refers to negative reaction enthalpy; a separate activation-energy barrier can remain."],"reject":["An exothermic reaction must have zero energy barrier and proceed instantly."]},{"subject":"Chemistry","id":"task1_chem_047","section":"Arrhenius activation energy","originalFront":"What does a catalyst do to activation energy?","originalBack":"It provides an alternative route with lower activation energy.","accept":["A catalyst allows a reaction pathway with lower activation energy."],"reject":["A catalyst makes a reaction faster by increasing activation energy."]},{"subject":"Chemistry","id":"chem_kp_recap_20261024_definition","section":"Kp gaseous equilibrium","originalFront":"Define Kp for a homogeneous gaseous equilibrium.","originalBack":"The equilibrium constant expressed using the equilibrium partial pressures of the gases, at a fixed temperature.","accept":["The equilibrium constant calculated from equilibrium partial gas pressures at one temperature."],"reject":["Kp uses the initial gas partial pressures instead of their equilibrium values."]},{"subject":"Chemistry","id":"chem_kp_recap_20261024_kp_nh3","section":"Kp gaseous equilibrium","originalFront":"Write Kp for N₂(g) + 3H₂(g) ⇌ 2NH₃(g).","originalBack":"Kp = p(NH₃)² ÷ [p(N₂) × p(H₂)³]. Use equilibrium partial pressures.","accept":["For the Haber equilibrium, Kp=(pNH3)^2/((pN2)(pH2)^3)."],"reject":["For N2+3H2 reversible 2NH3, Kp=(pN2)(pH2)^3/(pNH3)^2."]},{"subject":"Chemistry","id":"chem_kp_recap_20261024_kp_unitless","section":"Kp gaseous equilibrium","originalFront":"When do the pressure units of Kp cancel?","originalBack":"When the total gaseous coefficients are equal on both sides, so Δn = 0.","accept":["Pressure powers cancel if the total gaseous mole coefficients on each side are equal."],"reject":["A Kp expression always has units of kPa irrespective of its gas coefficients."]},{"subject":"Chemistry","id":"chem_lattice_diss","section":"Born Haber and lattice enthalpy","originalFront":"Define lattice dissociation enthalpy.","originalBack":"The enthalpy change when 1 mole of an ionic solid is completely separated into its constituent gaseous ions.","accept":["The enthalpy change for breaking one mole of solid ionic lattice into separate gaseous ions."],"reject":["Lattice dissociation enthalpy is energy released when gaseous ions form an ionic solid."]},{"subject":"Chemistry","id":"chem_entropy_gibbs_recap_20261024_catalyst_gibbs","section":"Entropy and Gibbs free energy","originalFront":"Does a catalyst change ΔG or thermodynamic feasibility?","originalBack":"No. A catalyst lowers activation energy and increases rate; it does not change ΔG for the overall reaction.","accept":["It does not change Gibbs energy, only the reaction pathway and rate via a reduced activation barrier."],"reject":["Adding a catalyst changes equilibrium Gibbs energy and makes an infeasible reaction feasible."]},{"subject":"Chemistry","id":"chem_entropy_gibbs_recap_20261024_entropy_temp_effect","section":"Entropy and Gibbs free energy","originalFront":"How does increasing T affect ΔG when ΔS is positive versus negative?","originalBack":"For ΔS > 0, ΔG decreases (more favourable). For ΔS < 0, ΔG increases (less favourable).","accept":["If delta S>0, higher T lowers delta G; if delta S<0, higher T raises delta G, assuming delta H and delta S unchanged."],"reject":["Higher temperature always makes delta G smaller, regardless of the sign of delta S."]},{"subject":"Chemistry","id":"task1_chem_180","section":"Strong weak acids pH Ka Kw","originalFront":"What does a larger Ka usually indicate?","originalBack":"A stronger weak acid.","accept":["A greater acid dissociation constant corresponds to greater dissociation and a stronger weak acid."],"reject":["For two comparable weak acids, the smaller Ka indicates the stronger acid."]},{"subject":"Chemistry","id":"task1_chem_129","section":"Halogenoalkane substitution elimination","originalFront":"What is nucleophilic substitution?","originalBack":"A nucleophile replaces another atom or group.","accept":["It is a reaction where a nucleophile takes the place of a leaving atom or group."],"reject":["Nucleophilic substitution means adding a nucleophile without expelling any leaving group."]},{"subject":"Chemistry","id":"chem_mechanisms_v42_19","section":"Alcohol oxidation and dehydration","originalFront":"What distinguishes hydration from dehydration?","originalBack":"Hydration adds water; dehydration removes it.","accept":["Hydration adds the elements of water; dehydration eliminates the elements of water."],"reject":["Hydration removes water whereas dehydration adds it."]},{"subject":"Chemistry","id":"task1_chem_203","section":"Aldehydes ketones carbonyl tests","originalFront":"What is the functional group in an aldehyde?","originalBack":"Terminal carbonyl group, –CHO.","accept":["The aldehyde functional group is -CHO, a carbonyl at the end of a carbon chain."],"reject":["An aldehyde is a carbonyl between two carbon groups, RCO R'."]},{"subject":"Chemistry","id":"chem_amount_v44_34","section":"Chemistry required practical accuracy","originalFront":"How is percentage titre uncertainty found?","originalBack":"Absolute titre uncertainty ÷ titre ×100.","accept":["Absolute uncertainty in the measured titre divided by titre, multiplied by 100 percent."],"reject":["Percentage titre uncertainty is the titre divided by absolute uncertainty times 100."]}];
function applyV328ScienceCoreCalibration(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V328_REVIEWED_SCIENCE_CORE){
  const card=byId.get(row.id);
  if(!card||card.subject!==row.subject||card.front!==row.originalFront||card.back!==row.originalBack)continue;
  if(row.revisedBack)card.back=row.revisedBack;
  card.accept=[...new Set([card.back,row.originalBack,...(card.accept||[]),...row.accept])];
  card.reject=[...new Set([...(card.reject||[]),...row.reject])];
  card.v328ExactReviewed=true;
 }
 return existing;
}

// v329: final original-core Year 1 Pure Maths wrong-answer calibration; remove three false positives.
const V329_MATHS_CORE_PRECISION=[{"id":"math_surds_rationalise","subject":"Maths","front":"How do you rationalise 1/(a+√b)?","back":"Multiply numerator and denominator by the conjugate a−√b.","addedAccepted":["Multiply top and bottom by a minus square root b, the conjugate of the denominator."],"addedRejected":["Multiply numerator and denominator only by (a+sqrt b).","Multiply the numerator by a-sqrt b but leave the denominator unchanged."],"invalidLegacyAccepted":[]},{"id":"math_logs_change","subject":"Maths","front":"How can a^x=b be rewritten using logs?","back":"x = logₐb.","addedAccepted":["For valid a and b, x=log base a of b."],"addedRejected":["x=log base b of a.","x=a times log b."],"invalidLegacyAccepted":[]},{"id":"v33_card_maths_trigonometry_73","subject":"Maths","front":"What identity links sin²θ and cos²θ?","back":"sin²θ+cos²θ=1.","addedAccepted":["The identity is sin(theta)^2+cos(theta)^2=1."],"addedRejected":["sin squared theta plus cos squared theta equals zero.","sin squared theta minus cos squared theta equals one."],"invalidLegacyAccepted":["Pythagorean identity"]},{"id":"v33_card_maths_trigonometry_74","subject":"Maths","front":"When solving sin x=k, why should you check beyond the calculator's principal value?","back":"Trigonometric functions are periodic and can have multiple solutions in the specified interval.","addedAccepted":["Sine is periodic, so there may be additional angle solutions within the required interval."],"addedRejected":["The inverse sine calculator returns all solutions in every interval.","There can only ever be one solution to sin x=k."],"invalidLegacyAccepted":[]},{"id":"v33_card_maths_transformations_75","subject":"Maths","front":"Which direction does y=f(x−a) translate a graph if a>0?","back":"a units to the right.","addedAccepted":["Translate the graph a units in the positive x direction."],"addedRejected":["The graph moves a units to the left.","The graph moves a units upwards."],"invalidLegacyAccepted":[]},{"id":"v33_card_maths_quadratics_78","subject":"Maths","front":"What does a negative discriminant say about real roots?","back":"A quadratic with real coefficients has no real roots if b²−4ac<0.","addedAccepted":["Discriminant below zero means no solutions in the real numbers."],"addedRejected":["A negative discriminant gives two different real roots.","A negative discriminant gives one repeated real root."],"invalidLegacyAccepted":[]},{"id":"v33_card_maths_algebra_85","subject":"Maths","front":"When cancelling a common factor from an algebraic fraction, what restriction must be retained?","back":"Any input that made the original denominator zero remains excluded.","addedAccepted":["The values that zero the original denominator are still excluded even after cancellation."],"addedRejected":["After cancelling the common factor, all former denominator zeros are allowed.","Removing a common factor changes the original domain to include its zeros."],"invalidLegacyAccepted":[]},{"id":"task1_v136_002","subject":"Maths","front":"State the index law a^m × a^n.","back":"a^(m+n), for the same non-zero base.","addedAccepted":["a^m multiplied by a^n equals a^(m+n), for the same base."],"addedRejected":["a^(mn) is the product of a^m and a^n.","a^m+a^n is the product of two powers with base a."],"invalidLegacyAccepted":["a^, for the same non-zero base."]},{"id":"task1_v136_003","subject":"Maths","front":"State the index law (a^m)^n.","back":"a^(mn).","addedAccepted":["(a^m)^n equals a^(m times n)."],"addedRejected":["(a^m)^n=a^(m+n).","(a^m)^n=a^(m-n)."],"invalidLegacyAccepted":[]},{"id":"task1_v136_065","subject":"Maths","front":"What does a remainder of zero show about a polynomial divisor (x−a)?","back":"(x−a) is a factor of the polynomial.","addedAccepted":["If f(a)=0 then (x-a) divides f(x), so (x-a) is a factor."],"addedRejected":["A zero remainder when dividing by (x-a) proves (x+a) must be a factor.","A zero remainder proves the polynomial has no factor (x-a)."],"invalidLegacyAccepted":["is a factor of the polynomial."]},{"id":"task1_v162_012","subject":"Maths","front":"What are the asymptotes of y = k/x when k≠0?","back":"x = 0 and y = 0.","addedAccepted":["Its horizontal and vertical asymptotes are y=0 and x=0 respectively."],"addedRejected":["The asymptotes of k/x are x=k and y=k.","The only asymptote of k/x is y=k."],"invalidLegacyAccepted":[]},{"id":"task1_v162_019","subject":"Maths","front":"State the change-of-base formula for logₐx.","back":"logₐx = ln x / ln a (a>0, a≠1; x>0).","addedAccepted":["For a>0 with a not 1 and x>0, log base a of x is ln(x)/ln(a)."],"addedRejected":["log_a x = ln(a)/ln(x).","log_a x = ln(a*x)."],"invalidLegacyAccepted":[]},{"id":"task1_v171_002","subject":"Maths","front":"On division of polynomial f(x) by (x−a), what is the remainder?","back":"f(a).","addedAccepted":["The remainder from division of f(x) by (x-a) is its value at a."],"addedRejected":["The remainder is the derivative f'(a).","The remainder is f(-a) for divisor x-a."],"invalidLegacyAccepted":[]},{"id":"task1_v171_008","subject":"Maths","front":"What symmetry does the graph of cos x have?","back":"It is even: cos(−x)=cos x.","addedAccepted":["cosine is even, so cos of negative x equals cos of x."],"addedRejected":["Cosine is odd and cos(-x)=-cos(x).","The cosine graph is reflected into itself across the x-axis rather than the y-axis."],"invalidLegacyAccepted":[]},{"id":"task1_v171_009","subject":"Maths","front":"What symmetry does the graph of sin x have?","back":"It is odd: sin(−x)=−sin x.","addedAccepted":["Sine is odd: sin(-x)=-sin(x), giving origin symmetry."],"addedRejected":["Sine is even and sin(-x)=sin(x).","The graph of sine is symmetric about the vertical y-axis."],"invalidLegacyAccepted":[]}];
function applyV329MathsCorePrecision(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V329_MATHS_CORE_PRECISION){
  const card=byId.get(row.id);
  if(!card||card.subject!==row.subject||card.front!==row.front||card.back!==row.back)continue;
  const invalid=new Set(row.invalidLegacyAccepted);
  card.accept=[...new Set([card.back,...(card.accept||[]).filter(x=>!invalid.has(x)),...row.addedAccepted])];
  card.reject=[...new Set([...(card.reject||[]),...row.invalidLegacyAccepted,...row.addedRejected])];
  card.v329ExactReviewed=true;
 }
 return existing;
}

// v330: 43 exact-ID science mock core reviews left in the balanced v323 sample after v328.
const V330_SCIENCE_CORE_PRECISION=[{"id":"phy_focus_v38_02","subject":"Physics","section":"Projectile motion","originalFront":"A projectile has initial horizontal velocity 12 m s⁻¹. Without air resistance, what is its speed at the highest point?","originalBack":"12 m s⁻¹.","accept":["At maximum height its vertical speed is zero, so its total speed is the unchanged 12 m s^-1 horizontal speed."],"reject":["Its speed is 0 m s^-1 at the highest point.","Its speed rises above 12 m s^-1 at the highest point."]},{"id":"task1_phy_062","subject":"Physics","section":"Stationary waves and harmonics","originalFront":"Which wave property stays unchanged across a stationary boundary?","originalBack":"Frequency.","accept":["The wave frequency remains the same when it passes into a different medium."],"reject":["The wavelength always stays the same when a wave enters a different medium.","The speed always remains unchanged as a wave crosses into another medium."]},{"id":"phy_spectra_photo_v32_classical_failure","subject":"Physics","section":"Photoelectric effect","originalFront":"Why does the photoelectric effect contradict the simple classical wave model?","originalBack":"Emission has a threshold frequency and no significant delay above it, even at low intensity.","accept":["There is a threshold frequency and prompt emission even for low intensity light above that threshold."],"reject":["Increasing intensity at any frequency eventually emits photoelectrons.","Very low-intensity light above threshold must first accumulate energy for a long delay."]},{"id":"phy_spectra_photo_v32_max_speed","subject":"Physics","section":"Photoelectric effect","originalFront":"How do you calculate the maximum speed of emitted photoelectrons?","originalBack":"Find Eₖ(max) = hf − φ in joules, then use vₘₐₓ = √(2Eₖ(max)/mₑ).","accept":["First find hf minus the work function, then calculate v = sqrt(2(hf - phi)/me) using energies in joules."],"reject":["Maximum electron speed equals (hf - phi) divided by electron mass.","Use sqrt(2hf/me), ignoring the metal work function."]},{"id":"phy_pandr_v29_sketch_photoelectric","subject":"Physics","section":"Photoelectric effect","originalFront":"How much energy does one photon transfer to one electron in the photoelectric effect?","originalBack":"hf.","accept":["One photon delivers energy E = h f to an electron."],"reject":["The transferred photon energy is hf minus the work function.","The energy transferred by one photon is h/f."]},{"id":"phy_pandr_v29_antizero_structure","subject":"Physics","section":"Particles quarks and interactions","originalFront":"What is the quark–antiquark content of anti-K⁰?","originalBack":"s + anti-d.","accept":["One strange quark and one anti-down quark."],"reject":["One down quark and one anti-strange quark.","One strange quark and one anti-up quark."]},{"id":"phy_pandr_v29_baryon_definition","subject":"Physics","section":"Particles quarks and interactions","originalFront":"Define a baryon.","originalBack":"A hadron made from three quarks; an antibaryon has three antiquarks.","accept":["A baryon is a hadron containing three quarks."],"reject":["A baryon contains one quark and one antiquark.","A baryon is a hadron containing two quarks and one lepton."]},{"id":"phy_pandr_v29_baryon_stability","subject":"Physics","section":"Particles quarks and interactions","originalFront":"Which baryon is stable in the AQA particle classification?","originalBack":"The proton; other baryons eventually decay.","accept":["The stable baryon is the proton."],"reject":["The free neutron is the only stable baryon.","The lambda baryon is the stable baryon."]},{"id":"task1_phy_008","subject":"Physics","section":"Electricity and potential dividers","originalFront":"What is the derived SI unit of resistivity?","originalBack":"Ohm metre (Ω m).","accept":["Resistivity has SI unit ohm metres, Ω m."],"reject":["The SI unit is ohms per metre, Ω/m.","The SI unit of resistivity is ohm metres to the power minus one."]},{"id":"task1_practical_010","subject":"Physics","section":"Electricity and potential dividers","originalFront":"How is wire cross-sectional area obtained from diameter d?","originalBack":"A = πd²/4.","accept":["Use A = pi(d/2)^2, where d is the diameter."],"reject":["The cross-sectional area is A = pi d^2.","The cross-sectional area is A = 2 pi d."]},{"id":"task1_chem_079","subject":"Chemistry","section":"Group 2 and group 7","originalFront":"How does first ionisation energy change down Group 2?","originalBack":"It decreases.","accept":["The first ionisation energy generally falls down Group 2 because shielding and atomic radius increase."],"reject":["The first ionisation energy increases steadily down Group 2.","The first ionisation energy is constant down Group 2."]},{"id":"task1_chem_157","subject":"Chemistry","section":"Inorganic tests and observations","originalFront":"What is the purpose of a chemical test for an organic group?","originalBack":"To identify a functional group by a characteristic observation.","accept":["Identify a functional group from a characteristic chemical reaction and observation."],"reject":["The test determines only the exact relative molecular mass of the organic compound.","The test always reveals the entire carbon skeleton without further information."]},{"id":"task1_chem_173","subject":"Chemistry","section":"Arrhenius activation energy","originalFront":"What is the Arrhenius plot gradient for ln k against 1/T?","originalBack":"−Ea/R.","accept":["The slope of ln k against inverse temperature is negative activation energy divided by R."],"reject":["The gradient of ln k against 1/T is +Ea/R.","The gradient of ln k against 1/T is -R/Ea."]},{"id":"chem_bh_defs_20261024_first_ionisation_bh","subject":"Chemistry","section":"Born Haber and lattice enthalpy","originalFront":"In a Born–Haber cycle, define first ionisation energy.","originalBack":"Energy required to remove 1 mole of electrons from 1 mole of gaseous atoms, forming gaseous 1+ ions.","accept":["One mole of gaseous atoms each loses one electron to form one mole of gaseous 1+ ions."],"reject":["It is the energy to remove a second electron from one mole of gaseous 1+ ions.","It is the energy released when gaseous 1+ ions gain an electron."]},{"id":"chem_entropy","subject":"Chemistry","section":"Entropy and Gibbs free energy","originalFront":"When does entropy usually increase?","originalBack":"When particles become more dispersed/disordered, especially when more gas particles are formed.","accept":["Entropy generally rises when there are more gas particles and greater dispersal of energy and matter."],"reject":["Producing more gas particles always lowers entropy.","Changing a gas into a solid usually raises entropy."]},{"id":"task1_chem_179","subject":"Chemistry","section":"Strong weak acids pH Ka Kw","originalFront":"What is Ka?","originalBack":"The acid dissociation equilibrium constant.","accept":["Ka is the equilibrium constant for HA dissociating into H+ and A- in solution."],"reject":["Ka is the rate constant for acid dissociation.","Ka is the ionic product of water."]},{"id":"chem_carboxy_acid","subject":"Chemistry","section":"Strong weak acids pH Ka Kw","originalFront":"Why are carboxylic acids weak acids?","originalBack":"They only partially dissociate in water.","accept":["Carboxylic acid molecules ionise only partly in aqueous solution."],"reject":["Carboxylic acids fully dissociate in water.","They are weak only because their solutions are always dilute."]},{"id":"chem_mechanisms_v42_18","subject":"Chemistry","section":"Halogenoalkane substitution elimination","originalFront":"How can proton transfer assist an alcohol elimination mechanism?","originalBack":"It changes –OH to a better leaving group and permits catalyst regeneration.","accept":["Protonation changes -OH into an -OH2+ group so that water can leave, with acid regenerated."],"reject":["Proton transfer converts -OH into O2- to make it a better leaving group.","Protonating an alcohol prevents water from leaving."]},{"id":"task1_chem_132","subject":"Chemistry","section":"Halogenoalkane substitution elimination","originalFront":"What happens in elimination from a halogenoalkane?","originalBack":"H and a halogen leave, creating a C=C bond.","accept":["A hydrogen and halogen are removed from neighbouring carbons, producing an alkene double bond."],"reject":["The halogen is replaced by OH to form an alcohol.","Elimination removes a C=C bond and creates a saturated carbon chain."]},{"id":"task1_chem_133","subject":"Chemistry","section":"Halogenoalkane substitution elimination","originalFront":"What is the main type of product from nucleophilic substitution by OH⁻?","originalBack":"An alcohol.","accept":["A halogenoalkane undergoes substitution by hydroxide to form an alcohol."],"reject":["Nucleophilic substitution by OH- yields a ketone.","Nucleophilic substitution by OH- gives an alkene by loss of HX."]},{"id":"task1_chem_063","subject":"Chemistry","section":"Alcohol oxidation and dehydration","originalFront":"What is an oxidising agent?","originalBack":"Species that accepts electrons and is reduced.","accept":["An oxidising agent accepts electrons and is itself reduced."],"reject":["An oxidising agent donates electrons and becomes oxidised.","An oxidising agent always increases its own oxidation state."]},{"id":"task1_chem_095","subject":"Chemistry","section":"Alcohol oxidation and dehydration","originalFront":"Which is the stronger oxidising agent: chlorine or bromine?","originalBack":"Chlorine.","accept":["Chlorine, Cl2, is a stronger oxidising agent than bromine."],"reject":["Bromine is the stronger oxidising agent.","Chlorine and bromine have exactly equal oxidising strengths."]},{"id":"task1_chem_096","subject":"Chemistry","section":"Alcohol oxidation and dehydration","originalFront":"How does oxidising strength change down Group 7?","originalBack":"It decreases.","accept":["Oxidising power decreases from chlorine to bromine to iodine."],"reject":["Oxidising strength increases down Group 7.","The oxidising strength of the halogens does not vary down the group."]},{"id":"chem_mechanisms_v42_26","subject":"Chemistry","section":"Optical isomerism and chirality","originalFront":"Why can some carbonyl additions create enantiomer pairs?","originalBack":"Attack from opposite faces of the planar carbonyl creates different configurations.","accept":["Nucleophiles can attack either face of a planar carbonyl, producing mirror-image products if a new chiral centre forms."],"reject":["A carbonyl can only be attacked from one face, so only one configuration is formed.","The carbonyl carbon is already tetrahedral, preventing opposite-face attack."]},{"id":"chem_mechanisms_v42_28","subject":"Chemistry","section":"Optical isomerism and chirality","originalFront":"Why does a racemic mixture give no net optical rotation?","originalBack":"The enantiomers' rotations cancel.","accept":["Equal amounts of opposite enantiomers rotate plane-polarised light by equal and opposite angles, giving zero net rotation."],"reject":["A racemic mixture has no optical rotation because every molecule is achiral.","The enantiomers in a racemic mixture both rotate light the same way."]},{"id":"task1_chem_199","subject":"Chemistry","section":"Optical isomerism and chirality","originalFront":"What is a chiral centre?","originalBack":"Usually a carbon bonded to four different groups.","accept":["A typical chiral centre is a tetrahedral carbon attached to four different substituents."],"reject":["A carbon joined to four identical groups is a chiral centre.","Any carbon atom double-bonded to oxygen is automatically a chiral centre."]},{"id":"task1_chem_204","subject":"Chemistry","section":"Aldehydes ketones carbonyl tests","originalFront":"What is the functional group in a ketone?","originalBack":"Carbonyl group between two carbon atoms.","accept":["A ketone contains R-C(=O)-R' with carbon groups on both sides of the carbonyl carbon."],"reject":["A ketone always has a terminal -CHO group.","The ketone functional group is -COOH."]},{"id":"task1_chem_205","subject":"Chemistry","section":"Aldehydes ketones carbonyl tests","originalFront":"What forms when a ketone is reduced?","originalBack":"A secondary alcohol.","accept":["Reduction of a ketone produces a secondary alcohol."],"reject":["Reducing a ketone produces a primary alcohol.","Reducing a ketone produces a tertiary alcohol."]},{"id":"task1_chem_206","subject":"Chemistry","section":"Aldehydes ketones carbonyl tests","originalFront":"What forms when an aldehyde is reduced?","originalBack":"A primary alcohol.","accept":["Reduction of an aldehyde produces a primary alcohol."],"reject":["Reducing an aldehyde produces a secondary alcohol.","Reducing an aldehyde produces a tertiary alcohol."]},{"id":"chem_spec_v40_002","subject":"Chemistry","section":"Carboxylic acids esters and acyl","originalFront":"Why is a carboxylic acid described as weak?","originalBack":"Only a fraction of its molecules dissociate into ions in water.","accept":["Carboxylic acids are weak because most molecules remain undissociated in water at equilibrium."],"reject":["They are weak because they completely ionise in water.","They are weak only because the acid solution must be dilute."]},{"id":"chem_spec_v40_003","subject":"Chemistry","section":"Carboxylic acids esters and acyl","originalFront":"Why do carboxylic acids react with carbonates?","originalBack":"Their acidic protons react with carbonate ions, releasing carbon dioxide.","accept":["An acid reacts with a carbonate to produce a carboxylate salt, water and carbon dioxide."],"reject":["Carboxylic acids react with carbonates to release hydrogen gas rather than carbon dioxide.","A carbonate reaction with a carboxylic acid produces chlorine gas."]},{"id":"chem_spec_v40_005","subject":"Chemistry","section":"Carboxylic acids esters and acyl","originalFront":"What numbering rule applies when naming a carboxylic acid?","originalBack":"The carbon in –COOH is carbon number 1.","accept":["The carboxyl carbon in the COOH group is carbon 1."],"reject":["Number the carbon next to COOH as carbon 1, ignoring the carboxyl carbon.","Always start numbering from the far end away from COOH."]},{"id":"chem_spec_v40_006","subject":"Chemistry","section":"Carboxylic acids esters and acyl","originalFront":"What is the ester functional group?","originalBack":"R–C(=O)–O–R′.","accept":["An ester has the linkage R-C(=O)-O-R'."],"reject":["An ester has the functional group R-COOH.","An ester has the functional group R-CONH2."]},{"id":"task1_chem_213","subject":"Chemistry","section":"Amines amides and acylation","originalFront":"What does an acyl chloride contain?","originalBack":"The –COCl functional group.","accept":["The acyl chloride functional group is R-C(=O)-Cl."],"reject":["An acyl chloride has the -COOH functional group.","An acyl chloride contains -COOR rather than -COCl."]},{"id":"task1_v124_bulk_chem_214","subject":"Chemistry","section":"Amines amides and acylation","originalFront":"What acyl product forms when an acyl chloride reacts with ammonia?","originalBack":"A primary amide.","accept":["An acyl chloride plus ammonia forms RCONH2, a primary amide."],"reject":["Reaction with ammonia gives an ester RCOOR'.","Acyl chloride plus ammonia forms only an N-alkyl amide RCONHR'."]},{"id":"task1_v124_bulk_chem_215","subject":"Chemistry","section":"Amines amides and acylation","originalFront":"What acyl product forms when an acyl chloride reacts with a primary amine?","originalBack":"An N-substituted amide.","accept":["An acyl chloride and a primary amine form an N-substituted amide RCONHR'."],"reject":["Reaction with a primary amine forms the unsubstituted amide RCONH2 only.","The acyl product is an ester RCOOR'."]},{"id":"task1_v124_bulk_chem_216","subject":"Chemistry","section":"Amines amides and acylation","originalFront":"Why are acyl chlorides more reactive than amides?","originalBack":"Chloride is a much better leaving group.","accept":["Chloride is a better leaving group than amide, making acyl chlorides more readily substituted."],"reject":["The -NH2 group is a much better leaving group than chloride.","Acyl chlorides are less reactive because their chlorine cannot leave."]},{"id":"chem_spec_v40_016","subject":"Chemistry","section":"Biodiesel triglycerides saponification","originalFront":"Which acid-derived groups are joined to glycerol in a triglyceride?","originalBack":"Three long-chain fatty acid residues.","accept":["A triglyceride has glycerol esterified with three long-chain fatty acid residues."],"reject":["Glycerol in a triglyceride is linked to three amino-acid residues.","A triglyceride contains only one fatty acid residue joined to glycerol."]},{"id":"chem_spec_v40_017","subject":"Chemistry","section":"Biodiesel triglycerides saponification","originalFront":"Can a triglyceride contain three different fatty acids?","originalBack":"Yes. The three long chains need not be identical.","accept":["Yes, each ester-linked fatty acid chain can be different."],"reject":["No, triglycerides must have three identical fatty acid chains.","A triglyceride can have only two fatty acid chains."]},{"id":"chem_spec_v40_018","subject":"Chemistry","section":"Biodiesel triglycerides saponification","originalFront":"What is saponification?","originalBack":"Alkaline hydrolysis of fats or oils.","accept":["Saponification is base hydrolysis of fats or oils to glycerol and fatty acid salts."],"reject":["Saponification is acid-catalysed esterification making triglycerides.","Saponification is oxidation of fats to form ketones."]},{"id":"chem_spec_v40_020","subject":"Chemistry","section":"Biodiesel triglycerides saponification","originalFront":"Why does soap clean oily substances?","originalBack":"Its non-polar tail interacts with oil and its ionic head with water.","accept":["The non-polar hydrocarbon tail associates with oil and the hydrophilic ionic head stays in water, allowing micelles."],"reject":["The ionic soap head dissolves in oil and the hydrocarbon tail dissolves in water.","Soap cleans oil by reacting to release oxygen gas."]},{"id":"chem_energetics_v49_60","subject":"Chemistry","section":"Chemistry required practical accuracy","originalFront":"What is AQA Required Practical 2 about?","originalBack":"Measuring an enthalpy change using calorimetry.","accept":["AQA Required Practical 2 uses temperature changes and calorimetry to measure an enthalpy change."],"reject":["Required Practical 2 determines reaction rate from gas volume against time.","Required Practical 2 determines Mr by mass spectrometry."]},{"id":"chem_energetics_v51_01","subject":"Chemistry","section":"Chemistry required practical accuracy","originalFront":"A thermometer is ±0.1°C per reading. What is the uncertainty in ΔT?","originalBack":"±0.2°C: add the absolute uncertainties of initial and final readings.","accept":["Plus or minus 0.2 degrees Celsius, since uncertainty in the two readings is added."],"reject":["The total uncertainty in the temperature difference is only plus or minus 0.1 degrees Celsius.","Uncertainty in the temperature change is plus or minus 0.01 degrees Celsius."]}];
function applyV330ScienceCoreCalibration(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V330_SCIENCE_CORE_PRECISION){
  const c=byId.get(row.id);
  if(!c||c.subject!==row.subject||c.front!==row.originalFront||c.back!==row.originalBack)continue;
  c.accept=[...new Set([c.back,...(c.accept||[]),...row.accept])];
  c.reject=[...new Set([...(c.reject||[]),...row.reject])];
  c.v330ExactReviewed=true;
 }
 return existing;
}

// v331: exact-front/back review of 65 additional first-school-mock original science cards.
const V331_REVIEWED_CORE_VARIANTS=[{"id":"phy_uncert_systematic","subject":"Physics","topic":"Measurements","stage":"AS","originalFront":"What is a systematic error?","originalBack":"A consistent shift in readings caused by the method or instrument; repeats do not remove it.","accept":["A systematic error biases readings consistently and is not eliminated by repeating measurements."],"reject":["It causes random scatter that averaging always removes.","It is a measurement error that changes sign unpredictably on every trial."]},{"id":"phy_uncert_power","subject":"Physics","topic":"Measurements","stage":"AS","originalFront":"If y = xⁿ, what happens to percentage uncertainty?","originalBack":"Multiply the percentage uncertainty in x by |n|.","accept":["For y equal to x to the power n, multiply the percentage uncertainty of x by the magnitude of n."],"reject":["Divide the percentage uncertainty by n regardless of the exponent.","The percentage uncertainty of x never changes when it is raised to a power."]},{"id":"phy_measure_recap_20261024_derived_n","subject":"Physics","topic":"Measurements","stage":"AS","originalFront":"Express the newton (N) using SI base units.","originalBack":"1 N = 1 kg m s⁻², from F = ma.","accept":["One newton equals one kilogram metre per second squared, kg m s^-2."],"reject":["A newton is kg m^2 s^-2.","A newton equals kg m s^-1."]},{"id":"phy_measure_recap_20261024_derived_j","subject":"Physics","topic":"Measurements","stage":"AS","originalFront":"Express the joule (J) using SI base units.","originalBack":"1 J = 1 kg m² s⁻², because work done = force × distance.","accept":["A joule is one kilogram metre squared per second squared, kg m^2 s^-2."],"reject":["A joule has the same SI dimensions as a newton.","A joule is kg m^2 s^-3."]},{"id":"phy_measure_recap_20261024_derived_w","subject":"Physics","topic":"Measurements","stage":"AS","originalFront":"Express the watt (W) using SI base units.","originalBack":"1 W = 1 kg m² s⁻³, because power = energy ÷ time.","accept":["A watt is one kilogram metre squared per second cubed, kg m^2 s^-3."],"reject":["A watt is kg m^2 s^-2.","A watt is kg m s^-2."]},{"id":"task1_phy_069","subject":"Physics","topic":"Mechanics","stage":"AS","originalFront":"What is the principle of moments?","originalBack":"In equilibrium, total clockwise moment equals total anticlockwise moment.","accept":["The clockwise and anticlockwise moments about a point balance for rotational equilibrium."],"reject":["In equilibrium the total clockwise moment is greater than anticlockwise moment.","The principle of moments requires the clockwise moments to be zero individually."]},{"id":"task1_phy_071","subject":"Physics","topic":"Mechanics","stage":"AS","originalFront":"What does a negative velocity indicate?","originalBack":"Motion opposite to the chosen positive direction.","accept":["The object's velocity is directed opposite the chosen positive axis."],"reject":["Negative velocity means that the object must be slowing down.","Negative velocity always means that its acceleration is negative."]},{"id":"task1_phy_072","subject":"Physics","topic":"Mechanics","stage":"AS","originalFront":"What does a negative acceleration mean?","originalBack":"Acceleration opposite to the chosen positive direction.","accept":["The acceleration vector is pointing in the negative reference direction."],"reject":["A negative acceleration always means decreasing speed.","Negative acceleration always indicates that velocity is negative."]},{"id":"task1_phy_073","subject":"Physics","topic":"Mechanics","stage":"AS","originalFront":"Is deceleration always a negative acceleration?","originalBack":"No; it depends on the chosen positive direction.","accept":["No. Deceleration means decreasing speed, while the sign of acceleration depends on your chosen axis."],"reject":["Yes, deceleration always corresponds to an acceleration less than zero.","Deceleration can only happen while velocity is positive."]},{"id":"task1_phy_074","subject":"Physics","topic":"Mechanics","stage":"AS","originalFront":"How do you get total distance from a velocity–time graph?","originalBack":"Add the magnitudes of all areas.","accept":["Sum the absolute areas under every portion of the velocity-time graph."],"reject":["Add signed areas below the axis as negative distance.","Find total distance by taking only the gradient of the velocity-time graph."]},{"id":"phy_moments_001","subject":"Physics","topic":"Moments","stage":"AS","originalFront":"What distance must be used in moment = force × distance?","originalBack":"The perpendicular distance from the pivot to the force's line of action.","accept":["Use the shortest perpendicular distance between the pivot and the line along which the force acts."],"reject":["Always use the length of the lever even if the force acts at an angle.","Use the distance measured parallel to the direction of the force."]},{"id":"phy_graph_weakness_v36_force_extension_area","subject":"Physics","topic":"Materials","stage":"AS","originalFront":"A spring force rises linearly 0→40 N during 0.50 m extension. Find energy stored.","originalBack":"Area under F–extension = ½×40×0.50 = 10 J.","accept":["Ten joules: the triangular area is one half multiplied by 40 N multiplied by 0.50 m."],"reject":["Twenty joules because energy is the rectangle 40 times 0.5.","Eighty joules because energy equals force divided by extension."]},{"id":"phy_mechanics_focus_v37_26","subject":"Physics","topic":"Materials","stage":"AS","originalFront":"A spring extends 0.060 m under 12 N within its Hooke's-law region. Find stiffness.","originalBack":"k = F/ΔL = 12/0.060 = 200 N m⁻¹.","accept":["Two hundred newtons per metre, from 12 divided by 0.060."],"reject":["0.005 newtons per metre, from 0.060 divided by 12.","720 newtons per metre, from 12 times 0.060."]},{"id":"phy_mechanics_focus_v37_30","subject":"Physics","topic":"Materials","stage":"AS","originalFront":"A material retains extension after the force is removed. What behaviour has occurred?","originalBack":"Plastic deformation: it has a permanent extension after unloading.","accept":["Permanent deformation has occurred: the material has been plastically deformed."],"reject":["It is purely elastic deformation because it retains its extension.","The material must still obey Hooke's law perfectly after unloading."]},{"id":"phy_mechanics_focus_v37_31","subject":"Physics","topic":"Materials","stage":"AS","originalFront":"How does ductile failure typically differ from brittle failure?","originalBack":"Ductile materials undergo substantial plastic deformation before breaking; brittle materials undergo little.","accept":["A ductile solid shows considerable plastic extension before breaking, unlike a brittle solid."],"reject":["Brittle solids always have much greater plastic extension than ductile ones.","A ductile material breaks without undergoing any plastic deformation."]},{"id":"task1_phy_038","subject":"Physics","topic":"Waves","stage":"AS","originalFront":"What is a progressive wave?","originalBack":"A travelling disturbance that transfers energy without net mass transfer.","accept":["A progressive wave carries energy as a disturbance travels, without overall transport of the medium."],"reject":["A progressive wave carries the medium's particles along permanently with the wave.","A progressive wave cannot transfer energy."]},{"id":"task1_phy_041","subject":"Physics","topic":"Waves","stage":"AS","originalFront":"What is polarisation evidence for?","originalBack":"Transverse oscillations.","accept":["Polarisation shows that the wave has transverse oscillations."],"reject":["Polarisation proves the wave is longitudinal.","Polarisation is evidence that wave speed is zero."]},{"id":"task1_phy_042","subject":"Physics","topic":"Waves","stage":"AS","originalFront":"Why can sound in air not be polarised?","originalBack":"It is longitudinal.","accept":["Sound waves in air have oscillations parallel to propagation, so they cannot be polarised."],"reject":["Sound in air is transverse and therefore polarises.","Sound waves are unpolarised because they do not carry energy."]},{"id":"task1_phy_049","subject":"Physics","topic":"Waves","stage":"AS","originalFront":"How does increasing string tension change wave speed?","originalBack":"It increases, proportional to √tension.","accept":["The speed rises with the square root of tension if mass per unit length stays fixed."],"reject":["Wave speed decreases in proportion to the square root of string tension.","Doubling tension always doubles wave speed."]},{"id":"task1_phy_050","subject":"Physics","topic":"Waves","stage":"AS","originalFront":"What is mass per unit length of a string?","originalBack":"μ = mass/length, measured in kg m⁻¹.","accept":["Mass per unit length is mu equals m divided by L, in kg per metre."],"reject":["The mass per unit length equals length divided by mass.","The unit of linear mass density is kg m."]},{"id":"task1_phy_051","subject":"Physics","topic":"Interference","stage":"AS","originalFront":"What does coherent mean for two wave sources?","originalBack":"Same frequency with constant phase difference.","accept":["Coherent sources have equal frequencies and a constant phase difference."],"reject":["Coherent sources need only have the same amplitude.","Coherent sources have a phase difference that varies randomly."]},{"id":"task1_phy_058","subject":"Physics","topic":"Interference","stage":"AS","originalFront":"Which colour spreads most in a white-light diffraction grating?","originalBack":"Red; it has the longest wavelength.","accept":["Red light is diffracted through the largest angle because its wavelength is greatest."],"reject":["Violet light always has the greatest diffraction angle in the same order.","All visible colours are diffracted through identical angles."]},{"id":"task1_phy_059","subject":"Physics","topic":"Interference","stage":"AS","originalFront":"What happens to a single-slit central maximum when the slit narrows?","originalBack":"It becomes wider.","accept":["The central bright maximum becomes wider when a single slit is made narrower."],"reject":["The central bright maximum gets narrower as the slit narrows.","A narrower slit means no diffraction occurs."]},{"id":"task1_phy_060","subject":"Physics","topic":"Interference","stage":"AS","originalFront":"What is the highest possible order for a grating?","originalBack":"The largest integer n with nλ ≤ d.","accept":["The greatest possible order is the largest whole number no greater than d divided by wavelength."],"reject":["The greatest order is any integer larger than d divided by wavelength.","There is no limit to order even if n lambda exceeds d."]},{"id":"phy_nuclide","subject":"Physics","topic":"Particles","stage":"AS","originalFront":"In nuclide notation, what do A and Z mean?","originalBack":"A = nucleon number; Z = proton number.","accept":["A is the total number of protons and neutrons; Z is the proton number."],"reject":["A counts only the neutrons and Z counts all nucleons.","A is the proton number and Z is the neutron number."]},{"id":"phy_pair_production","subject":"Physics","topic":"Particles","stage":"AS","originalFront":"What is needed for pair production?","originalBack":"A photon with enough energy creates a particle–antiparticle pair, usually near a nucleus to conserve momentum.","accept":["A sufficiently energetic photon can create a particle-antiparticle pair near a nucleus to conserve momentum."],"reject":["Pair production means a particle and antiparticle turn into one photon.","Pair production creates a single charged particle without its antiparticle."]},{"id":"phy_hadrons","subject":"Physics","topic":"Particles","stage":"AS","originalFront":"What are hadrons?","originalBack":"Particles made of quarks that experience the strong interaction.","accept":["Hadrons consist of quarks and take part in strong interactions."],"reject":["Hadrons are fundamental leptons made without quarks.","Hadrons do not experience the strong nuclear interaction."]},{"id":"task1_phy_093","subject":"Physics","topic":"Electricity","stage":"AS","originalFront":"What is an ideal ammeter's resistance?","originalBack":"Zero.","accept":["An ideal ammeter has zero resistance, so it adds no voltage drop in series."],"reject":["An ideal ammeter has infinite resistance.","An ideal ammeter must be connected in parallel across the component."]},{"id":"task1_phy_095","subject":"Physics","topic":"Electricity","stage":"AS","originalFront":"What condition is required for Ohm's law?","originalBack":"Constant physical conditions, including temperature.","accept":["Ohm's law applies at constant physical conditions, particularly constant temperature."],"reject":["Ohm's law requires the resistor temperature to increase as the current rises.","Ohm's law applies only if the applied voltage stays at zero."]},{"id":"task1_phy_096","subject":"Physics","topic":"Electricity","stage":"AS","originalFront":"Why does a filament lamp's I–V curve flatten at high voltage?","originalBack":"Its filament heats up and resistance rises.","accept":["The hotter filament has higher resistance, so current rises less quickly as voltage increases."],"reject":["The filament cools as voltage rises and resistance falls.","The lamp's resistance remains constant at higher current."]},{"id":"chem_ar_def","subject":"Chemistry","topic":"Atomic structure","stage":"AS","originalFront":"Define relative atomic mass, Ar.","originalBack":"Weighted mean mass of an atom relative to 1/12 of the mass of a carbon-12 atom.","accept":["Ar is the abundance-weighted average atomic mass relative to one twelfth the mass of a carbon-12 atom."],"reject":["Ar is simply the mass number of the most abundant isotope, ignoring abundance.","Ar is the average atomic mass relative to one whole carbon-12 atom."]},{"id":"chem_isotope","subject":"Chemistry","topic":"Atomic structure","stage":"AS","originalFront":"What are isotopes?","originalBack":"Atoms of the same element with the same proton number but different neutron numbers.","accept":["Isotopes share a proton number but contain different numbers of neutrons."],"reject":["Isotopes of an element have different proton numbers.","Isotopes have the same proton and neutron numbers but a different electron shell count."]},{"id":"chem_atom_economy","subject":"Chemistry","topic":"Amount of substance","stage":"AS","originalFront":"What is atom economy?","originalBack":"Mr of desired product ÷ total Mr of reactants, accounting for coefficients, × 100.","accept":["Atom economy is the desired product's formula mass divided by the sum of formula masses of reactants, with coefficients, times one hundred."],"reject":["Atom economy is the actual mass obtained divided by the theoretical yield.","Atom economy always equals the percentage yield."]},{"id":"chem_amount_v44_16","subject":"Chemistry","topic":"Amount of substance","stage":"AS","originalFront":"What is the formula for percentage yield?","originalBack":"100×actual yield/theoretical yield, using the same units.","accept":["Percentage yield equals actual yield divided by theoretical yield multiplied by one hundred."],"reject":["Percentage yield equals theoretical yield divided by actual yield times one hundred.","Percentage yield equals desired product Mr divided by total reactant Mr."]},{"id":"chem_amount_v44_19","subject":"Chemistry","topic":"Amount of substance","stage":"AS","originalFront":"What is the difference between atom economy and percentage yield?","originalBack":"Atom economy is theoretical atom distribution; yield compares actual and maximum product.","accept":["Atom economy concerns theoretical destination of reactant atoms; percentage yield concerns actual versus theoretical product."],"reject":["Both atom economy and percentage yield are the same comparison of actual product to maximum product.","Atom economy measures how fast the reaction goes while yield measures equilibrium constant."]},{"id":"chem_bonding_v47_02","subject":"Chemistry","topic":"Bonding","stage":"AS","originalFront":"Why is NaCl not made of separate NaCl molecules?","originalBack":"The ions form a giant 3D lattice attracted in all directions.","accept":["Sodium chloride forms an extended three-dimensional lattice of oppositely charged ions rather than distinct NaCl molecules."],"reject":["Each NaCl unit is a separate covalent molecule with a Na-Cl bond.","Solid NaCl consists of isolated ion pairs with no interactions beyond each pair."]},{"id":"chem_bonding_v47_07","subject":"Chemistry","topic":"Bonding","stage":"AS","originalFront":"What is the formula of aluminium sulfate from Al³⁺ and SO₄²⁻?","originalBack":"Al₂(SO₄)₃: total charges +6 and −6 balance.","accept":["Aluminium sulfate is Al2(SO4)3, balancing two aluminium 3+ ions with three sulfate 2- ions."],"reject":["The formula is AlSO4.","The formula is Al3(SO4)2."]},{"id":"chem_energetics_v49_07","subject":"Chemistry","topic":"Energetics","stage":"AS","originalFront":"Does a catalyst change a reaction's ΔH?","originalBack":"No; it changes activation energy, not the initial/final enthalpy difference.","accept":["Catalysts alter activation energy but not the enthalpy difference between products and reactants."],"reject":["A catalyst makes the reaction enthalpy more negative.","A catalyst changes the energy of the products without altering the reactants."]},{"id":"task1_chem_032","subject":"Chemistry","topic":"Energetics","stage":"AS","originalFront":"What is an exothermic reaction?","originalBack":"A reaction that releases heat to the surroundings; ΔH is negative.","accept":["An exothermic reaction transfers heat to the surroundings and has a negative enthalpy change."],"reject":["Exothermic reactions take in heat and have positive delta H.","Exothermic reactions have zero enthalpy change."]},{"id":"task1_chem_033","subject":"Chemistry","topic":"Energetics","stage":"AS","originalFront":"What is an endothermic reaction?","originalBack":"A reaction that absorbs heat from the surroundings; ΔH is positive.","accept":["An endothermic reaction takes in heat from the surroundings and has a positive enthalpy change."],"reject":["An endothermic reaction releases heat and has negative delta H.","An endothermic reaction cannot exchange thermal energy."]},{"id":"task1_chem_037","subject":"Chemistry","topic":"Energetics","stage":"AS","originalFront":"Why are bond enthalpies usually positive?","originalBack":"Energy is needed to break bonds.","accept":["Bond-breaking requires energy input, hence bond dissociation enthalpies are positive."],"reject":["Breaking a bond always releases heat and has negative bond enthalpy.","Bond enthalpy is negative because new bonds always form simultaneously."]},{"id":"task1_chem_085","subject":"Chemistry","topic":"Group 2","stage":"AS","originalFront":"Which Group 2 sulfate is essentially insoluble?","originalBack":"Barium sulfate, BaSO₄.","accept":["Barium sulfate, BaSO4, is effectively insoluble."],"reject":["Magnesium sulfate is the least soluble Group 2 sulfate.","Barium sulfate dissolves readily in water."]},{"id":"task1_chem_090","subject":"Chemistry","topic":"Group 2","stage":"AS","originalFront":"What observation indicates sulfate ions in the barium-ion test?","originalBack":"A white barium sulfate precipitate.","accept":["Formation of a white precipitate of barium sulfate is the positive sulfate-ion observation."],"reject":["Sulfate gives a yellow silver iodide precipitate with barium ions.","The sulfate test is positive only when the solution remains clear."]},{"id":"task1_chem_094","subject":"Chemistry","topic":"Group 7","stage":"AS","originalFront":"Why do halogen boiling points rise down the group?","originalBack":"More electrons produce stronger van der Waals' forces.","accept":["Larger halogen molecules have more electrons, making London dispersion forces stronger down the group."],"reject":["Boiling points rise because covalent bonds within halogen molecules become stronger.","London dispersion forces become weaker as electron count increases down Group 7."]},{"id":"task1_chem_097","subject":"Chemistry","topic":"Group 7","stage":"AS","originalFront":"How does reducing strength of halide ions change down the group?","originalBack":"It increases.","accept":["Halide ions become stronger reducing agents down the group because they lose electrons more readily."],"reject":["Reducing strength decreases from chloride to iodide.","Halide ions cannot act as reducing agents."]},{"id":"chem_rate_order0","subject":"Chemistry","topic":"Rate equations","stage":"A2","originalFront":"What does zero order in A mean?","originalBack":"Changing [A] does not change the rate; [A]⁰ = 1.","accept":["For a zero-order reactant the rate is independent of its concentration."],"reject":["Zero order means doubling concentration doubles the rate.","Zero order means the reactant has a negative concentration."]},{"id":"chem_rate_recap_20261024_second_rate_graph","subject":"Chemistry","topic":"Rate equations","stage":"A2","originalFront":"What shape is the rate–[A] graph for second order?","originalBack":"An upward-curving parabola: rate is proportional to [A]².","accept":["For second order, rate is proportional to concentration squared, giving an upward-curved graph."],"reject":["Second order produces a horizontal straight line on a rate-versus-concentration graph.","Second order produces a straight line through the origin on a rate-versus-concentration graph."]},{"id":"chem_collision","subject":"Chemistry","topic":"Kinetics","stage":"AS","originalFront":"What two conditions make a collision successful?","originalBack":"Particles collide with energy at least equal to Ea and with a suitable orientation.","accept":["A successful collision needs sufficient energy to overcome activation energy and a suitable orientation."],"reject":["Any collision is successful as long as particles have enough mass.","A collision is successful even with energy below activation energy."]},{"id":"chem_catalyst","subject":"Chemistry","topic":"Kinetics","stage":"AS","originalFront":"How does a catalyst increase reaction rate?","originalBack":"It provides an alternative route with lower activation energy.","accept":["A catalyst offers an alternative reaction pathway with a lower activation energy."],"reject":["A catalyst increases reaction rate by increasing activation energy.","A catalyst speeds a reaction by changing equilibrium enthalpy."]},{"id":"chem_kp_recap_20261024_fractions_sum","subject":"Chemistry","topic":"Kp","stage":"A2","originalFront":"What must all mole fractions in a gas mixture add up to?","originalBack":"Exactly 1, when all gases present are included.","accept":["The mole fractions of every gas present add up to one."],"reject":["All gas mole fractions must add up to the total pressure.","All mole fractions in a gas mixture add up to zero."]},{"id":"chem_ea1","subject":"Chemistry","topic":"Born–Haber cycles","stage":"A2","originalFront":"What is first electron affinity?","originalBack":"Enthalpy change when one mole of gaseous atoms each gains one electron to form gaseous 1− ions.","accept":["First electron affinity is the enthalpy change when one mole of gaseous atoms each gains one electron to form gaseous 1- ions."],"reject":["First electron affinity involves removal of electrons from gaseous atoms.","First electron affinity is defined for atoms in the solid state gaining electrons."]},{"id":"task1_chem_164","subject":"Chemistry","topic":"Thermodynamics","stage":"A2","originalFront":"What is the condition for thermodynamic feasibility using Gibbs free energy?","originalBack":"ΔG < 0 at the stated temperature.","accept":["Negative Gibbs free energy change, delta G less than zero, indicates thermodynamic feasibility in the forward direction."],"reject":["A positive delta G always guarantees spontaneous forward reaction.","A negative activation energy is the criterion for thermodynamic feasibility."]},{"id":"task1_chem_165","subject":"Chemistry","topic":"Thermodynamics","stage":"A2","originalFront":"Does thermodynamic feasibility guarantee a fast reaction?","originalBack":"No; kinetic barriers can make it slow.","accept":["No. A negative Gibbs change is compatible with a high activation energy and a very slow reaction."],"reject":["Every thermodynamically feasible reaction must be fast.","Thermodynamic feasibility eliminates any kinetic barrier."]},{"id":"task1_chem_176","subject":"Chemistry","topic":"Acids and bases","stage":"A2","originalFront":"What is a conjugate acid–base pair?","originalBack":"Two species differing by one proton.","accept":["A conjugate acid-base pair differs by one hydrogen ion, H+."],"reject":["A conjugate acid-base pair differs by one electron.","A conjugate acid-base pair must contain two unrelated substances with the same pH."]},{"id":"task1_chem_131","subject":"Chemistry","topic":"Halogenoalkanes","stage":"AS","originalFront":"Which haloalkane reacts fastest in hydrolysis: fluoro or iodo?","originalBack":"Iodoalkane, because its C–I bond is weaker.","accept":["Iodoalkanes hydrolyse more quickly because the carbon-iodine bond is weaker than carbon-fluorine."],"reject":["Fluoroalkanes hydrolyse faster because the C-F bond is easiest to break.","Both haloalkanes have identical hydrolysis rates because all C-halogen bonds have identical strength."]},{"id":"task1_chem_134","subject":"Chemistry","topic":"Halogenoalkanes","stage":"AS","originalFront":"What is the organic product type from substitution by CN⁻?","originalBack":"A nitrile.","accept":["Nucleophilic substitution by cyanide forms a nitrile containing the -C triple bond N group."],"reject":["Substitution by cyanide gives an aldehyde as the main product.","Substitution by cyanide produces a haloalkane containing -COOH."]},{"id":"task1_chem_146","subject":"Chemistry","topic":"Alcohols","stage":"AS","originalFront":"What does oxidising a primary alcohol first produce?","originalBack":"An aldehyde.","accept":["A primary alcohol is first oxidised to an aldehyde."],"reject":["Oxidising a primary alcohol initially produces a ketone.","Primary alcohols are not oxidisable under normal laboratory conditions."]},{"id":"task1_chem_149","subject":"Chemistry","topic":"Alcohols","stage":"AS","originalFront":"Why are tertiary alcohols resistant to normal oxidation?","originalBack":"No hydrogen on the carbon attached to –OH.","accept":["Tertiary alcohols lack a hydrogen on the carbon bearing the OH group, so ordinary oxidation does not occur."],"reject":["Tertiary alcohols oxidise most easily because they have three carbon groups.","They resist oxidation because the OH group is absent."]},{"id":"task1_chem_201","subject":"Chemistry","topic":"Optical isomerism","stage":"A2","originalFront":"What is a racemic mixture?","originalBack":"Equal amounts of two enantiomers.","accept":["A racemic mixture has equal quantities of the two enantiomers."],"reject":["A racemic mixture contains only one enantiomer.","A racemic mixture always has a 90:10 ratio of enantiomers."]},{"id":"chem_mechanisms_v42_21","subject":"Chemistry","topic":"Aldehydes and ketones","stage":"A2","originalFront":"Where do the C=O bonding electrons move during nucleophilic addition?","originalBack":"Towards oxygen while the incoming group bonds to carbon.","accept":["The carbonyl pi-electron pair moves onto the oxygen as the nucleophile bonds to carbon."],"reject":["The C=O bonding electron pair moves onto carbon while the nucleophile attaches to oxygen.","The carbonyl oxygen donates its lone pair to form a new C=O triple bond."]},{"id":"task1_chem_207","subject":"Chemistry","topic":"Aldehydes and ketones","stage":"A2","originalFront":"Which carbonyl compound gives a positive Tollens' test?","originalBack":"An aldehyde.","accept":["An aldehyde gives a positive Tollens' silver mirror test."],"reject":["Ketones always give Tollens' silver mirror test, whereas aldehydes never do.","All carbonyl compounds always give a positive Tollens' result."]},{"id":"task1_chem_211","subject":"Chemistry","topic":"Carboxylic acids","stage":"A2","originalFront":"What is esterification?","originalBack":"Formation of an ester from a carboxylic acid and alcohol.","accept":["Esterification joins an alcohol and a carboxylic acid to form an ester and water."],"reject":["Esterification is addition of water to cleave an ester.","Esterification forms an amide directly from two alcohols."]},{"id":"chem_spec_v40_013","subject":"Chemistry","topic":"Esters","stage":"A2","originalFront":"Why does alkaline ester hydrolysis tend to completion?","originalBack":"Formation of the stable carboxylate ion inhibits the reverse reaction.","accept":["Base hydrolysis tends to go to completion because a carboxylate ion forms, making reverse esterification unfavourable."],"reject":["Alkaline hydrolysis remains fully reversible because the carboxylate ion is readily protonated by the base.","Alkaline hydrolysis is driven to completion because all products are gases."]},{"id":"chem_prac_meniscus","subject":"Chemistry","topic":"Practical skills","stage":"AS","originalFront":"How should a colourless liquid meniscus be read?","originalBack":"At eye level, using the bottom of the meniscus.","accept":["Read the bottom of the colourless meniscus level with your eyes to avoid parallax."],"reject":["Read the upper edge of the colourless meniscus from above.","Read a colourless meniscus from well below eye level for accuracy."]},{"id":"task1_chem_202","subject":"Chemistry","topic":"Optical isomerism","stage":"A2","originalFront":"What does a racemic mixture do to plane-polarised light?","originalBack":"Produces no net rotation.","accept":["Equal and opposite optical rotations cancel, so a racemate gives no net rotation of plane-polarised light."],"reject":["A racemate rotates plane-polarised light twice as much as a pure enantiomer.","Both enantiomers rotate plane-polarised light in the same direction."]}];
function applyV331CoreAnswerCalibration(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V331_REVIEWED_CORE_VARIANTS){
  const c=byId.get(row.id);
  if(!c||c.subject!==row.subject||c.front!==row.originalFront||c.back!==row.originalBack)continue;
  c.accept=[...new Set([c.back,...(c.accept||[]),...row.accept])];
  c.reject=[...new Set([...(c.reject||[]),...row.reject])];
  c.v331ExactReviewed=true;
 }
 return existing;
}

// v343: exact-ID editorial review of 52 original, mock-eligible science cards.
// Strictly refuse listed conceptual reversals before similarity-based marking;
// accept an independently checked equivalent short answer. Preserve saved IDs.
const V343_REVIEWED_CORE_VARIANTS=[{"id":"phy_series_current","subject":"Physics","originalFront":"What is true of current in a series circuit?","originalBack":"The current is the same at every point.","accept":["The current does not split along a series path."],"reject":["Current splits between the components in series.","Current can be different at each point of one series branch."]},{"id":"phy_series_pd","subject":"Physics","originalFront":"What happens to p.d. in a series circuit?","originalBack":"The supply p.d. equals the sum of component p.d.s.","accept":["The supply voltage equals the sum of the voltage drops across series components."],"reject":["Potential difference is necessarily identical across every series component.","The component voltage drops must exceed the supply voltage."]},{"id":"phy_parallel_pd","subject":"Physics","originalFront":"What is true of p.d. across parallel branches?","originalBack":"It is the same across each branch.","accept":["The potential difference is identical across all parallel branches."],"reject":["The supply voltage is divided between separate parallel branches.","Parallel branches must each have a different p.d."]},{"id":"phy_resistivity","subject":"Physics","originalFront":"What equation links resistance and resistivity?","originalBack":"R = ρL/A.","accept":["Resistance is resistivity multiplied by wire length divided by cross-sectional area."],"reject":["R = ρA/L.","Resistance is proportional to cross-sectional area at constant length."]},{"id":"phy_uncert_percent","subject":"Physics","originalFront":"How do you calculate percentage uncertainty?","originalBack":"percentage uncertainty = absolute uncertainty ÷ measured value × 100%","accept":["Percentage uncertainty equals absolute uncertainty divided by the measurement multiplied by 100."],"reject":["Percentage uncertainty equals measured value divided by absolute uncertainty times 100.","Percentage uncertainty equals absolute uncertainty times the measured value."]},{"id":"phy_uncert_products","subject":"Physics","originalFront":"For multiplication or division, how are percentage uncertainties combined?","originalBack":"Add the percentage uncertainties.","accept":["Add the percentage uncertainties of factors in a product or quotient."],"reject":["Multiply the percentage uncertainties together.","Add only absolute uncertainties in different units."]},{"id":"v33_card_physics_motion_graphs_11","subject":"Physics","originalFront":"What does the area under a velocity–time graph represent?","originalBack":"Signed displacement, with area below the time axis counting as negative.","accept":["The signed area gives displacement, with area below zero counted negatively."],"reject":["Area below the axis must be made positive when finding signed displacement.","The area under a velocity–time graph gives acceleration."]},{"id":"v33_card_physics_motion_graphs_13","subject":"Physics","originalFront":"What does area under an acceleration–time graph give?","originalBack":"Change in velocity, including sign.","accept":["Integrating acceleration over time gives signed change in velocity."],"reject":["The area under an acceleration–time graph is displacement.","The area always gives final velocity without knowing initial velocity."]},{"id":"v33_card_physics_interference_16","subject":"Physics","originalFront":"What is needed for a stable two-source interference fringe pattern?","originalBack":"Two coherent sources with constant phase difference and same frequency.","accept":["The sources need the same frequency and a constant phase difference."],"reject":["Different frequencies produce a stable interference pattern if their amplitudes match.","A phase difference that changes randomly gives permanent bright and dark fringes."]},{"id":"task1_phy_052","subject":"Physics","originalFront":"What path difference produces constructive interference?","originalBack":"An integer multiple of λ.","accept":["Path difference nλ for integer n."],"reject":["Path difference of an odd multiple of half a wavelength.","Path difference (n + 0.5)λ causes constructive interference."]},{"id":"task1_phy_053","subject":"Physics","originalFront":"What path difference produces destructive interference?","originalBack":"An odd multiple of λ/2.","accept":["Path difference (n + 1/2)λ where n is an integer."],"reject":["A whole-number multiple of λ produces destructive interference.","Equal path lengths guarantee destructive interference."]},{"id":"task1_v124_bulk_phy_046","subject":"Physics","originalFront":"How does fringe spacing change if double-slit separation increases?","originalBack":"It decreases.","accept":["The fringe spacing becomes smaller, since w is inversely proportional to slit separation."],"reject":["Fringe spacing gets larger when the slits move further apart.","Fringe spacing does not change when the separation is doubled."]},{"id":"task1_v125_059","subject":"Physics","originalFront":"What happens to ray direction when light enters a more optically dense medium obliquely?","originalBack":"It bends towards the normal.","accept":["The refracted ray bends closer to the normal."],"reject":["The ray bends away from the normal in the more optically dense medium.","The refracted ray must always run along the boundary."]},{"id":"task1_v125_060","subject":"Physics","originalFront":"What happens to light speed when refractive index increases?","originalBack":"It decreases.","accept":["Light slows down as the refractive index increases."],"reject":["Its speed rises as refractive index increases.","Speed of light is the same in all transparent materials."]},{"id":"task1_v129_002","subject":"Physics","originalFront":"What is material dispersion in an optical fibre?","originalBack":"Pulse spreading because different wavelengths travel at different speeds.","accept":["Different wavelengths travel at different speeds within the fibre and broaden the pulse."],"reject":["Material dispersion means different ray paths have different lengths even at one wavelength.","Material dispersion is the absorption of photons by the core."]},{"id":"task1_v129_003","subject":"Physics","originalFront":"What is modal dispersion in a step-index optical fibre?","originalBack":"Pulse spreading because light travels along different paths of different lengths.","accept":["Different guided ray paths have different journey times, broadening the pulse."],"reject":["Modal dispersion occurs because different wavelengths travel at different speeds.","Every ray travels exactly the same path length through a step-index fibre."]},{"id":"task1_v125_009","subject":"Physics","originalFront":"What does the line of action of a force mean?","originalBack":"An imaginary line in the direction of the force.","accept":["The straight line through the force's point of application in the force direction."],"reject":["The line perpendicular to the force joining its point to the pivot.","The perpendicular shortest distance from the pivot to the force."]},{"id":"task1_v125_012","subject":"Physics","originalFront":"How many forces form a couple?","originalBack":"Two equal, opposite, parallel forces.","accept":["Two equal, opposite, parallel forces with different lines of action."],"reject":["Two equal parallel forces pointing the same way.","Two equal and opposite forces acting along exactly the same line."]},{"id":"task1_v125_013","subject":"Physics","originalFront":"Can a couple change an object's linear momentum on its own?","originalBack":"No: its resultant force is zero.","accept":["No, the resultant force is zero so a pure couple cannot change linear momentum."],"reject":["A couple produces a nonzero total force and accelerates the centre of mass.","A couple always increases the object's translational speed."]},{"id":"task1_v125_014","subject":"Physics","originalFront":"Does the moment of a couple depend on pivot position?","originalBack":"No.","accept":["No, a couple has the same moment about any pivot."],"reject":["Yes, a couple's moment changes when the pivot is moved.","The moment of a couple is always zero about its midpoint."]},{"id":"task1_v125_033","subject":"Physics","originalFront":"Why can a longer collision time reduce the mean impact force?","originalBack":"The same momentum change occurs over more time.","accept":["The average force is momentum change divided by contact time, so a longer time gives a smaller force."],"reject":["For the same momentum change, longer contact time makes mean force larger.","The impact force is independent of collision duration for a fixed impulse."]},{"id":"v33_card_physics_waves_18","subject":"Physics","originalFront":"What kind of waves can be polarised?","originalBack":"Transverse waves; longitudinal oscillations cannot be plane-polarised in the same way.","accept":["Only transverse waves can be plane-polarised in a specified vibration direction."],"reject":["Longitudinal sound waves can be plane-polarised in the same way.","Every type of wave can be plane-polarised regardless of oscillation direction."]},{"id":"chem_energetics_v49_02","subject":"Chemistry","originalFront":"What does negative ΔH mean?","originalBack":"Exothermic: heat is released to the surroundings.","accept":["A negative ΔH means an exothermic reaction releases heat to its surroundings."],"reject":["Negative reaction ΔH always means heat is absorbed.","A negative enthalpy change means products have higher enthalpy than reactants."]},{"id":"chem_energetics_v49_03","subject":"Chemistry","originalFront":"What does positive ΔH mean?","originalBack":"Endothermic: heat is absorbed from the surroundings.","accept":["A positive ΔH means the process absorbs heat from the surroundings."],"reject":["Positive ΔH means an exothermic reaction releases heat.","The products must be lower in enthalpy than the reactants when ΔH is positive."]},{"id":"chem_energetics_v49_04","subject":"Chemistry","originalFront":"Where do products lie on an exothermic enthalpy profile?","originalBack":"Lower in enthalpy than the reactants.","accept":["Products are at a lower enthalpy level than reactants for an exothermic process."],"reject":["Exothermic products lie higher than reactants on an enthalpy profile.","An exothermic reaction has no enthalpy difference between products and reactants."]},{"id":"chem_energetics_v49_05","subject":"Chemistry","originalFront":"Where do products lie on an endothermic enthalpy profile?","originalBack":"Higher in enthalpy than the reactants.","accept":["The products lie at a higher enthalpy than the starting reactants."],"reject":["Endothermic products lie below the reactants.","A positive reaction enthalpy means product enthalpy is less than reactant enthalpy."]},{"id":"chem_energetics_v49_09","subject":"Chemistry","originalFront":"What conditions must standard enthalpy values use?","originalBack":"100 kPa, a stated temperature and specified standard states.","accept":["Standard enthalpies use 100 kPa and stated temperature, usually 298 K, with substances in standard states."],"reject":["Standard enthalpies always require 101.3 kPa and any physical state.","A standard enthalpy can use 1 kPa with arbitrary states and no stated temperature."]},{"id":"chem_energetics_v49_39","subject":"Chemistry","originalFront":"What is the formation-enthalpy calculation for ΔH°reaction?","originalBack":"Sum of product ΔfH° values minus sum of reactant ΔfH° values.","accept":["Reaction ΔH° is the sum of product formation enthalpies minus the sum for reactants, using equation coefficients."],"reject":["Subtract product formation enthalpies from reactant values.","Ignore stoichiometric coefficients when adding formation enthalpies."]},{"id":"chem_energetics_v49_44","subject":"Chemistry","originalFront":"Why is the ΔfH° of H₂(g) zero?","originalBack":"Hydrogen gas is elemental hydrogen in its standard state.","accept":["Hydrogen H₂ gas is the element in its standard state, so its standard formation enthalpy is zero."],"reject":["The hydrogen–hydrogen bond requires zero energy to break.","All gaseous compounds have zero enthalpy of formation."]},{"id":"chem_bh_defs_20261024_latt_formation_eq","subject":"Chemistry","originalFront":"Write the lattice formation equation for NaCl.","originalBack":"Na⁺(g) + Cl⁻(g) → NaCl(s).","accept":["Na+(g) + Cl-(g) -> NaCl(s)"],"reject":["NaCl(s) -> Na+(g) + Cl-(g)","Na+(aq) + Cl-(aq) -> NaCl(s)"]},{"id":"chem_bh_defs_20261024_latt_diss_eq","subject":"Chemistry","originalFront":"Write the lattice dissociation equation for NaCl.","originalBack":"NaCl(s) → Na⁺(g) + Cl⁻(g).","accept":["NaCl(s) -> Na+(g) + Cl-(g)"],"reject":["Na+(g) + Cl-(g) -> NaCl(s)","NaCl(s) -> Na+(aq) + Cl-(aq)"]},{"id":"chem_bh_defs_20261024_second_ionisation_def","subject":"Chemistry","originalFront":"Define second ionisation energy.","originalBack":"Energy required to remove 1 mole of electrons from 1 mole of gaseous 1+ ions, forming gaseous 2+ ions.","accept":["Energy required to remove one mole of electrons from one mole of gaseous singly charged positive ions, producing gaseous doubly charged ions."],"reject":["The energy to remove an electron from neutral gaseous atoms to form 1+ ions.","The energy to remove two electrons at once from gaseous neutral atoms."]},{"id":"chem_rate_recap_20261024_zero_rate_graph","subject":"Chemistry","originalFront":"What shape is the rate–[A] graph for a zero-order reactant?","originalBack":"A horizontal straight line: rate does not depend on [A].","accept":["It is a horizontal straight line since rate does not depend on the reactant concentration."],"reject":["A line through the origin because rate is proportional to concentration.","An upward parabola because rate is proportional to the square of concentration."]},{"id":"chem_rate_recap_20261024_first_rate_graph","subject":"Chemistry","originalFront":"What shape is the rate–[A] graph for first order?","originalBack":"A straight line through the origin: rate is proportional to [A].","accept":["A straight line through the origin because rate is directly proportional to [A]."],"reject":["A horizontal line because the rate is independent of [A].","An upward parabola because rate is proportional to [A] squared."]},{"id":"chem_rate_recap_20261024_doubling_orders","subject":"Chemistry","originalFront":"On doubling [A], what happens to rate for order 0, 1 and 2?","originalBack":"Order 0: unchanged; order 1: ×2; order 2: ×4.","accept":["Zero order: unchanged; first order: double; second order: quadruple."],"reject":["Zero order: double; first order: quadruple; second order: unchanged.","Rate doubles for every order of reaction when concentration doubles."]},{"id":"chem_kp_recap_20261024_kp_units_ammonia","subject":"Chemistry","originalFront":"For N₂ + 3H₂ ⇌ 2NH₃, what are Kp units if pressure is measured in kPa?","originalBack":"kPa⁻².","accept":["kPa to the minus second power."],"reject":["kPa squared.","Kp must have no units for this equation when pressures are in kPa."]},{"id":"chem_kp_recap_20261024_equilibrium_not_initial","subject":"Chemistry","originalFront":"Which pressures must be used in a Kp expression?","originalBack":"Equilibrium partial pressures.","accept":["Use the partial pressure of each gas at equilibrium."],"reject":["Use the starting partial pressures before the equilibrium is reached.","Use the total pressure in place of each separate partial pressure."]},{"id":"v33_card_chemistry_equilibria_52","subject":"Chemistry","originalFront":"Does a catalyst change the equilibrium constant or position of equilibrium?","originalBack":"No. It accelerates forward and reverse reactions, so equilibrium is reached sooner without changing K.","accept":["No, a catalyst accelerates forward and reverse rates but does not shift equilibrium or change K."],"reject":["A catalyst increases K by shifting the balance towards the products.","Catalysts lower activation energy only for the forward reaction and alter the equilibrium position."]},{"id":"task1_chem_098","subject":"Chemistry","originalFront":"Can bromine displace chloride ions from solution?","originalBack":"No; bromine is a weaker oxidising agent.","accept":["No, bromine is a weaker oxidising agent than chlorine and cannot displace chloride."],"reject":["Yes, bromine displaces chloride ions because it is more reactive than chlorine.","Yes, bromine is a stronger oxidising agent than chlorine."]},{"id":"task1_chem_102","subject":"Chemistry","originalFront":"Which silver halide dissolves in dilute ammonia?","originalBack":"AgCl.","accept":["Silver chloride, AgCl, dissolves in dilute ammonia."],"reject":["AgBr.","AgI."]},{"id":"task1_chem_103","subject":"Chemistry","originalFront":"Which silver halide dissolves in concentrated ammonia, but not dilute?","originalBack":"AgBr.","accept":["Silver bromide, AgBr, dissolves in concentrated ammonia but not dilute."],"reject":["Silver iodide, AgI.","Silver chloride, AgCl."]},{"id":"task1_chem_104","subject":"Chemistry","originalFront":"Which silver halide is insoluble in ammonia?","originalBack":"AgI.","accept":["Silver iodide, AgI, is insoluble in aqueous ammonia."],"reject":["AgCl.","AgBr."]},{"id":"chem_atomic_v43_44","subject":"Chemistry","originalFront":"Why is Al first IE lower than Mg first IE?","originalBack":"Al loses a higher-energy 3p electron; Mg loses a lower-energy 3s electron.","accept":["Al loses a 3p electron, which is higher energy and easier to remove than Mg's 3s electron."],"reject":["Al has an additional occupied electron shell and hence more shielding than Mg.","Mg loses an outer 3p electron while aluminium loses a 3s electron."]},{"id":"chem_atomic_v43_45","subject":"Chemistry","originalFront":"Why is S first IE lower than P first IE?","originalBack":"Electron repulsion within a paired 3p orbital in S helps one electron escape.","accept":["Sulfur has two electrons paired in a 3p orbital, and repulsion makes one easier to remove than from phosphorus."],"reject":["Sulfur loses a 4s electron while phosphorus loses a 3p electron.","Phosphorus has a doubly occupied 3p orbital that sulfur does not have."]},{"id":"chem_carbonyl_reduction","subject":"Chemistry","originalFront":"What reagent reduces aldehydes and ketones?","originalBack":"NaBH₄, sodium tetrahydridoborate.","accept":["Sodium borohydride, NaBH4."],"reject":["Acidified potassium dichromate(VI).","Hydrogen cyanide and KCN."]},{"id":"chem_carbonyl_hcn","subject":"Chemistry","originalFront":"What mechanism occurs when HCN adds to a carbonyl compound?","originalBack":"Nucleophilic addition.","accept":["Nucleophilic addition to the C=O carbonyl bond."],"reject":["Electrophilic substitution of the carbonyl oxygen.","Free radical substitution."]},{"id":"chem_mechanisms_v42_23","subject":"Chemistry","originalFront":"What organic class comes from aldehyde reduction?","originalBack":"A primary alcohol.","accept":["A primary alcohol forms when an aldehyde is reduced."],"reject":["A secondary alcohol.","A ketone."]},{"id":"chem_mechanisms_v42_24","subject":"Chemistry","originalFront":"What organic class comes from ketone reduction?","originalBack":"A secondary alcohol.","accept":["The reduction of a ketone forms a secondary alcohol."],"reject":["A primary alcohol.","A carboxylic acid."]},{"id":"chem_alcohol_primary","subject":"Chemistry","originalFront":"What forms when a primary alcohol is oxidised gently and distilled?","originalBack":"An aldehyde.","accept":["An aldehyde is collected by distillation after controlled oxidation of a primary alcohol."],"reject":["A ketone.","The aldehyde must always be oxidised all the way to a carboxylic acid during immediate distillation."]},{"id":"chem_alcohol_primary_reflux","subject":"Chemistry","originalFront":"What forms when a primary alcohol is oxidised under reflux with excess oxidant?","originalBack":"A carboxylic acid.","accept":["An excess oxidant under reflux converts a primary alcohol into a carboxylic acid."],"reject":["An aldehyde is necessarily the final product under excess oxidant and reflux.","A ketone."]},{"id":"chem_alcohol_secondary","subject":"Chemistry","originalFront":"What forms when a secondary alcohol is oxidised?","originalBack":"A ketone.","accept":["A ketone forms when a secondary alcohol is oxidised."],"reject":["An aldehyde.","A carboxylic acid."]},{"id":"chem_bonding_v48_02","subject":"Chemistry","originalFront":"Rank lone–lone, lone–bond and bond–bond pair repulsion.","originalBack":"Lone–lone > lone–bond > bond–bond.","accept":["Lone pair–lone pair repulsion is strongest, then lone–bond, then bond–bond."],"reject":["Bond–bond > lone–bond > lone–lone.","All electron-pair repulsions are equally strong."]}];
function applyV343ScienceCorePrecision(existing){
 const byId=new Map(existing.map(c=>[c.id,c]));
 for(const row of V343_REVIEWED_CORE_VARIANTS){
  const c=byId.get(row.id);
  if(!c||c.subject!==row.subject||c.mock!==true||
     c.front!==row.originalFront||c.back!==row.originalBack)continue;
  c.accept=[...new Set([c.back,...(c.accept||[]),...row.accept])];
  c.reject=[...new Set([...(c.reject||[]),...row.reject])];
  c.v343ExactReviewed=true;
 }
 return existing;
}

// v332: AQA 3.1.8.2 includes the ΔG = 0 boundary in thermodynamic feasibility.
// This exact-ID repair preserves all previously correct negative-ΔG responses.
function applyV332GibbsBoundaryCorrection(existing){
 const card=existing.find(c=>c.id==='task1_chem_164');
 if(!card||card.subject!=='Chemistry'||card.front!=='What is the condition for thermodynamic feasibility using Gibbs free energy?'||card.back!=='ΔG < 0 at the stated temperature.')return existing;
 card.back='ΔG ≤ 0 at the stated temperature; ΔG = 0 marks equilibrium.';
 card.accept=[...new Set([card.back,...(card.accept||[]),'ΔG is negative or zero.','ΔG is zero or negative.','ΔG <= 0.','ΔG ≤ 0.'])];
 card.reject=[...new Set([...(card.reject||[]),'ΔG > 0 is thermodynamically feasible.','Only a positive ΔG indicates thermodynamic feasibility.'])];
 card.v332ExactReviewed=true;
 return existing;
}

// v217: Fix three previously audited legacy Chemistry cards in memory.
// Keep source deck.json and original card IDs stable for audit snapshots and saved progress.
/* v217 legacy chemistry corrections start */
const V217_LEGACY_CHEM_CORRECTIONS=Object.freeze({
  "chem_arrhenius_001": {
    "front": "For an Arrhenius graph of ln k against 1/T, in which unit must T be measured?",
    "back": "Kelvin (K).",
    "accept": [
      "Kelvin (K).",
      "Kelvin",
      "K",
      "absolute temperature in kelvin"
    ],
    "reject": [
      "degrees Celsius",
      "Celsius",
      "°C"
    ],
    "concepts": [
      [
        "kelvin"
      ]
    ],
    "strictRecall": true
  },
  "chem_cip": {
    "topic": "E/Z isomerism",
    "revisionTopic": "E/Z isomerism",
    "specRef": "3.3.1.3"
  },
  "chem_kp_recap_20261024_pressure_position": {
    "front": "For a gaseous equilibrium with different total gas mole coefficients on each side, which side is favoured by compression at constant temperature?",
    "back": "The side with fewer moles of gas.",
    "accept": [
      "The side with fewer moles of gas.",
      "side with fewer gas molecules",
      "side with fewer gaseous moles",
      "side with fewer moles of gas"
    ],
    "reject": [
      "side with more moles of gas",
      "no shift",
      "Kp increases"
    ],
    "strictRecall": true,
    "specRef": "3.1.10"
  }
});
function applyV217LegacyChemistryCorrections(deckCards){
 for(const card of deckCards){
  const correction=V217_LEGACY_CHEM_CORRECTIONS[card.id];
  if(correction&&card.subject==='Chemistry')Object.assign(card,correction);
 }
 return deckCards;
}
/* v217 legacy chemistry corrections end */

// v237: remove ambiguous molecular-angle prompts; preserve their original IDs,
// card answers and progress. The ideal angle requires bonding regions with NO
// lone electron pairs around the central atom.
const V237_BOND_ANGLE_FRONT=Object.freeze({
  chem_shape_linear:'For exactly two bonding regions and no lone pairs around the central atom, what is the bond angle?',
  chem_shape_trig:'For exactly three bonding regions and no lone pairs around the central atom, what is the bond angle?',
  chem_shape_tetra:'For exactly four bonding regions and no lone pairs around the central atom, what is the bond angle?'
});
function applyV237ChemBondAngleClarity(cardsToFix){
 for(const c of cardsToFix){
  if(c.subject==='Chemistry'&&c.stage==='AS'&&c.mock===true&&Object.prototype.hasOwnProperty.call(V237_BOND_ANGLE_FRONT,c.id))
   c.front=V237_BOND_ANGLE_FRONT[c.id];
 }
 return cardsToFix;
}
/* v237 chemistry bond-angle prompt clarification end */

/* v238: clarify singly charged molecular-ion interpretation without changing IDs. */
const V238_MOLECULAR_ION_PRECISION=Object.freeze({
  front:'In an electron-impact mass spectrum, what does the m/z of a singly charged molecular ion indicate?',
  back:'The relative molecular mass of the original molecule (m/z ≈ Mr for a 1+ molecular ion).',
  accept:[
   'The relative molecular mass of the original molecule (m/z ≈ Mr for a 1+ molecular ion).',
   'Its relative molecular mass, Mr.',
   'The Mr of the original molecule.',
   'Relative molecular mass of the molecule.'
  ],
  reject:['Mass number of the most abundant isotope.','The relative atomic mass of every atom in the molecule.'],
  specRef:'3.1.1.2'
});
function applyV238MolecularIonClarity(core){
 for(const c of core){
  if(c.id==='task1_chem_009'&&c.subject==='Chemistry'&&c.stage==='AS')
   Object.assign(c,V238_MOLECULAR_ION_PRECISION);
 }
 return core;
}
/* v238 molecular ion clarity end */


// v219: targeted AS TOF answer-level corrections; original source deck and IDs are unchanged.
/* v219 TOF correction block start */
const V219_TOF_CORRECTIONS=Object.freeze({
  "chem_atomic_v43_14": {
    "front": "Name the five stages of a simple time-of-flight mass spectrometer in order.",
    "back": "Ionisation → acceleration → ion drift → ion detection → data analysis.",
    "accept": [
      "Ionisation → acceleration → ion drift → ion detection → data analysis.",
      "ionisation, acceleration, drift, detection, data analysis",
      "ionization, acceleration, flight, detection, analysis",
      "ionise, accelerate, drift, detect, analyse"
    ],
    "reject": [
      "ionisation then detection then acceleration then drift then analysis",
      "ionisation, acceleration, drift, analysis (without detection)",
      "acceleration, ionisation, drift, detection, analysis"
    ],
    "strictRecall": true
  },
  "task1_v130_073": {
    "front": "For ions with the same charge and kinetic energy in TOF mass spectrometry, why can flight time distinguish their masses?",
    "back": "Lighter ions move faster and arrive at the detector sooner.",
    "accept": [
      "Lighter ions move faster and arrive at the detector sooner.",
      "At equal kinetic energy lighter ions have higher speeds.",
      "Lighter ions have a shorter time of flight.",
      "Ions with smaller mass arrive sooner when charge and kinetic energy are equal."
    ],
    "reject": [
      "Heavier ions arrive sooner.",
      "The lightest ions have lower speeds.",
      "Flight times are identical for all ion masses."
    ],
    "strictRecall": true
  },
  "task1_v130_074": {
    "front": "For singly charged ions with the same kinetic energy, which arrives sooner in TOF: lower or higher m/z?",
    "back": "Lower m/z, because the lighter ion moves faster.",
    "accept": [
      "Lower m/z, because the lighter ion moves faster.",
      "Lower m/z.",
      "The lower m/z ion.",
      "The lighter ion (lower mass-to-charge ratio)."
    ],
    "reject": [
      "Higher m/z.",
      "Higher mass ions arrive first.",
      "Both always arrive at the same time."
    ],
    "strictRecall": true
  }
});
function applyV219TofCorrections(deckCards){
 for(const card of deckCards){
  const update=V219_TOF_CORRECTIONS[card.id];
  if(update&&card.subject==='Chemistry'&&card.active!==false)Object.assign(card,update);
 }
 return deckCards;
}
/* v219 TOF correction block end */
// v220: clarify previously audited AS sulfate/halide-test and chlorine-water cards.
/* v220 ion-test correction block start */
const V220_ION_TEST_CORRECTIONS=Object.freeze({
  "task1_chem_089": {
    "front": "Why can carbonate ions give a false positive when sulfate is identified from a white barium precipitate?",
    "back": "Carbonate also forms an insoluble white barium carbonate precipitate.",
    "accept": [
      "Carbonate also forms an insoluble white barium carbonate precipitate.",
      "Barium carbonate is an insoluble white solid.",
      "Carbonate ions form white BaCO3.",
      "Carbonate can produce a similar white barium precipitate."
    ],
    "reject": [
      "Carbonate forms a blue barium compound.",
      "Because BaSO4 is highly soluble.",
      "Because sulfate ions turn litmus red."
    ],
    "strictRecall": true
  },
  "task1_chem_105": {
    "front": "Which interfering ion could cause a false positive in a silver-halide precipitate observation?",
    "back": "Carbonate ions, CO₃²⁻, because silver carbonate can also precipitate.",
    "accept": [
      "Carbonate ions, CO₃²⁻, because silver carbonate can also precipitate.",
      "Carbonate ions.",
      "CO3^2-",
      "Carbonate (CO₃²⁻)."
    ],
    "reject": [
      "Chloride ions are always a contaminant.",
      "Hydrogen ions.",
      "Sulfate ions only.",
      "A nitrate ion."
    ],
    "strictRecall": true
  },
  "chem_y1_chat_v126_096": {
    "front": "What is the balanced overall equation for the photochemical reaction of chlorine and water that releases oxygen?",
    "back": "2Cl₂ + 2H₂O → 4HCl + O₂.",
    "accept": [
      "2Cl₂ + 2H₂O → 4HCl + O₂.",
      "2Cl2 + 2H2O -> 4HCl + O2",
      "2 Cl2 + 2 H2O = 4 HCl + O2",
      "2Cl₂(aq) + 2H₂O(l) → 4HCl(aq) + O₂(g)"
    ],
    "reject": [
      "Cl2 + H2O -> HCl + HClO",
      "Cl2 + 2NaOH -> NaCl + NaClO + H2O",
      "2HCl + O2 -> Cl2 + H2O"
    ],
    "strictRecall": true
  }
});
function applyV220IonTestCorrections(deckCards){
 for(const card of deckCards){
  const changes=V220_ION_TEST_CORRECTIONS[card.id];
  if(changes&&card.subject==='Chemistry'&&card.stage==='AS')Object.assign(card,changes);
 }
 return deckCards;
}
/* v220 ion-test correction block end */
// v221: single-point AS RP3 relative-rate concept correction; preserve core card ID and progress.
/* v221 RP correction block start */
const V221_RP_CORRECTIONS=Object.freeze({
  "task1_practical_026": {
    "front": "Why is 1/t in a fixed-endpoint rate comparison a relative measure rather than an exact rate in mol dm⁻³ s⁻¹?",
    "back": "It does not include the concentration change; it only uses time to the same end point.",
    "accept": [
      "It does not include the concentration change; it only uses time to the same end point.",
      "It does not include how much concentration changes.",
      "It is an inverse time, not concentration change divided by time.",
      "It only measures the time to the common end point, not the absolute rate."
    ],
    "reject": [
      "It directly measures concentration change per second.",
      "It always equals the exact initial rate in mol dm-3 s-1.",
      "The end point must be different each time."
    ],
    "strictRecall": true
  }
});
function applyV221RpCorrections(deckCards){
 for(const card of deckCards){
  const change=V221_RP_CORRECTIONS[card.id];
  if(change&&card.subject==='Chemistry'&&card.stage==='AS')Object.assign(card,change);
 }
 return deckCards;
}
/* v221 RP correction block end */
const PIN_HASH='02a80993805958408c14d68623a229c86777980c55403d0c2fecf46904fe367c';
const PROGRESS_KEY='revisionLoopProgress5',PROFILE_KEY='revisionLoopProfile11',SETTINGS_KEY='revisionLoopSettings11';
let cards=[],examQuestions=[],deckMeta={},coverage={},deckVersion=0,bankVersion=0;
let progress=load(PROGRESS_KEY,{});
let profile=load(PROFILE_KEY,{});
let settings=load(SETTINGS_KEY,{});
let studyType='mock',activeSession=null,currentCardId=null,currentEvaluation=null,currentFlashAwarded=false,currentExamScore=0,manualScoreOverride=false,currentExamMarkingRoute='suggested',toastTimer=null;
let flashScopeFilter='taught',flashTopics=new Set(),examTopics=new Set(),examYears=new Set(),examTypes=new Set(),globeLon=0,globeLat=5,dragging=false,lastPointer=null,dragDistance=0,selectedLocation='london',openLocationId=null,locationVisibleLimit=24;

const CHARACTERS=[
 {id:'lelouch',name:'Lelouch',series:'Code Geass',cost:0,skin:'#efd0b5',hair:'#111827',hair2:'#312e81',style:'swept',eye:'#5b21b6'},
 {id:'cc',name:'C.C.',series:'Code Geass',cost:18,skin:'#efccb0',hair:'#65a30d',hair2:'#3f6212',style:'long',eye:'#d4d4d8'},
 {id:'suzaku',name:'Suzaku',series:'Code Geass',cost:22,skin:'#d9a77d',hair:'#5b4636',hair2:'#3f2f25',style:'messy',eye:'#166534'},
 {id:'kallen',name:'Kallen',series:'Code Geass',cost:26,skin:'#efc5a6',hair:'#b91c1c',hair2:'#7f1d1d',style:'messy',eye:'#60a5fa'},
 {id:'jeremiah',name:'Jeremiah',series:'Code Geass',cost:30,skin:'#d8a77f',hair:'#c2410c',hair2:'#7c2d12',style:'short',eye:'#3f6212'},

 {id:'light',name:'Light',series:'Death Note',cost:18,skin:'#e7bd9f',hair:'#7c4a2d',hair2:'#4a2c1a',style:'swept',eye:'#78350f'},
 {id:'l',name:'L',series:'Death Note',cost:22,skin:'#e8d1bf',hair:'#111827',hair2:'#0f172a',style:'messy',eye:'#111827',accessory:'darkeyes'},
 {id:'misa',name:'Misa',series:'Death Note',cost:26,skin:'#efc7aa',hair:'#eab308',hair2:'#a16207',style:'long',eye:'#78350f'},
 {id:'near',name:'Near',series:'Death Note',cost:30,skin:'#ead2bd',hair:'#e5e7eb',hair2:'#cbd5e1',style:'messy',eye:'#64748b'},
 {id:'ryuk',name:'Ryuk',series:'Death Note',cost:36,skin:'#9ca3af',hair:'#0f172a',hair2:'#020617',style:'spiky',eye:'#dc2626',accessory:'darkeyes'},

 {id:'eren',name:'Eren',series:'Attack on Titan',cost:20,skin:'#d7a27b',hair:'#4b3621',hair2:'#2f2418',style:'long',eye:'#16a34a'},
 {id:'mikasa',name:'Mikasa',series:'Attack on Titan',cost:24,skin:'#e0ad87',hair:'#111827',hair2:'#0f172a',style:'bob',eye:'#374151',accessory:'scarf'},
 {id:'levi',name:'Levi',series:'Attack on Titan',cost:28,skin:'#dfb18c',hair:'#111827',hair2:'#020617',style:'short',eye:'#64748b'},
 {id:'armin',name:'Armin',series:'Attack on Titan',cost:32,skin:'#efc9a9',hair:'#f2c94c',hair2:'#b7791f',style:'bob',eye:'#60a5fa'},
 {id:'erwin',name:'Erwin',series:'Attack on Titan',cost:36,skin:'#e3b48f',hair:'#d4a72c',hair2:'#8b6a16',style:'swept',eye:'#60a5fa'},

 {id:'isagi',name:'Isagi',series:'Blue Lock',cost:20,skin:'#e2b08c',hair:'#172554',hair2:'#0f172a',style:'short',eye:'#2563eb'},
 {id:'bachira',name:'Bachira',series:'Blue Lock',cost:24,skin:'#e0af88',hair:'#111827',hair2:'#eab308',style:'messy',eye:'#eab308'},
 {id:'rin_bl',name:'Rin',series:'Blue Lock',cost:28,skin:'#e3b48f',hair:'#164e63',hair2:'#0f172a',style:'swept',eye:'#0891b2'},
 {id:'nagi',name:'Nagi',series:'Blue Lock',cost:32,skin:'#efd0b5',hair:'#f1f5f9',hair2:'#cbd5e1',style:'messy',eye:'#64748b'},
 {id:'barou',name:'Barou',series:'Blue Lock',cost:36,skin:'#ce9067',hair:'#111827',hair2:'#7f1d1d',style:'spiky',eye:'#dc2626'},

 {id:'yuji',name:'Yuji',series:'Jujutsu Kaisen',cost:22,skin:'#e2ad86',hair:'#fb7185',hair2:'#be123c',style:'short',eye:'#78350f'},
 {id:'gojo',name:'Gojo',series:'Jujutsu Kaisen',cost:28,skin:'#efcdb1',hair:'#f8fafc',hair2:'#cbd5e1',style:'spiky',eye:'#38bdf8',accessory:'blindfold'},
 {id:'megumi',name:'Megumi',series:'Jujutsu Kaisen',cost:32,skin:'#ddb08d',hair:'#111827',hair2:'#020617',style:'spiky',eye:'#1f2937'},
 {id:'nobara',name:'Nobara',series:'Jujutsu Kaisen',cost:36,skin:'#e7b794',hair:'#9a3412',hair2:'#7c2d12',style:'bob',eye:'#78350f'},
 {id:'toji',name:'Toji',series:'Jujutsu Kaisen',cost:42,skin:'#b97852',hair:'#111827',hair2:'#020617',style:'short',eye:'#16a34a',accessory:'scar'},

 {id:'subaru',name:'Subaru',series:'Re:Zero',cost:22,skin:'#dca47e',hair:'#111827',hair2:'#020617',style:'short',eye:'#78350f'},
 {id:'emilia',name:'Emilia',series:'Re:Zero',cost:28,skin:'#f0ceb5',hair:'#e5e7eb',hair2:'#c4b5fd',style:'long',eye:'#a855f7'},
 {id:'rem',name:'Rem',series:'Re:Zero',cost:32,skin:'#edc3a6',hair:'#60a5fa',hair2:'#2563eb',style:'bob',eye:'#60a5fa'},
 {id:'beatrice',name:'Beatrice',series:'Re:Zero',cost:36,skin:'#efc9aa',hair:'#facc15',hair2:'#ca8a04',style:'long',eye:'#60a5fa'},
 {id:'echidna',name:'Echidna',series:'Re:Zero',cost:42,skin:'#f0cfb7',hair:'#f8fafc',hair2:'#d1d5db',style:'long',eye:'#111827'},

 {id:'klein',name:'Klein',series:'Lord of the Mysteries',cost:24,skin:'#ddb08b',hair:'#3f2d22',hair2:'#1f2937',style:'swept',eye:'#78350f'},
 {id:'audrey',name:'Audrey',series:'Lord of the Mysteries',cost:30,skin:'#efcaae',hair:'#eab308',hair2:'#a16207',style:'long',eye:'#16a34a'},
 {id:'alger',name:'Alger',series:'Lord of the Mysteries',cost:34,skin:'#b47b56',hair:'#1e3a8a',hair2:'#0f172a',style:'short',eye:'#1d4ed8'},
 {id:'leonard_lotm',name:'Leonard',series:'Lord of the Mysteries',cost:38,skin:'#d7a27d',hair:'#111827',hair2:'#166534',style:'messy',eye:'#16a34a'},
 {id:'azik',name:'Azik',series:'Lord of the Mysteries',cost:44,skin:'#9f6949',hair:'#111827',hair2:'#020617',style:'long',eye:'#78350f'},

 {id:'dokja',name:'Kim Dokja',series:'Omniscient Reader',cost:24,skin:'#e0b08e',hair:'#111827',hair2:'#020617',style:'short',eye:'#111827'},
 {id:'joonghyuk',name:'Yoo Joonghyuk',series:'Omniscient Reader',cost:30,skin:'#d49b74',hair:'#111827',hair2:'#020617',style:'swept',eye:'#111827'},
 {id:'sooyoung',name:'Han Sooyoung',series:'Omniscient Reader',cost:34,skin:'#e6b793',hair:'#111827',hair2:'#312e81',style:'bob',eye:'#5b21b6'},
 {id:'sangah',name:'Yoo Sangah',series:'Omniscient Reader',cost:38,skin:'#e8bc99',hair:'#6b4423',hair2:'#3f2f25',style:'long',eye:'#78350f'},
 {id:'heewon',name:'Jung Heewon',series:'Omniscient Reader',cost:44,skin:'#d79f78',hair:'#2f2418',hair2:'#111827',style:'long',eye:'#78350f'},

 {id:'thorfinn',name:'Thorfinn',series:'Vinland Saga',cost:24,skin:'#d7a27a',hair:'#d4a72c',hair2:'#8b6a16',style:'messy',eye:'#60a5fa'},
 {id:'askeladd',name:'Askeladd',series:'Vinland Saga',cost:30,skin:'#c58b62',hair:'#d1b56f',hair2:'#78716c',style:'swept',eye:'#64748b'},
 {id:'canute',name:'Canute',series:'Vinland Saga',cost:34,skin:'#efc7a6',hair:'#e8c547',hair2:'#a16207',style:'long',eye:'#60a5fa'},
 {id:'thorkell',name:'Thorkell',series:'Vinland Saga',cost:38,skin:'#c28258',hair:'#b45309',hair2:'#7c2d12',style:'spiky',eye:'#78350f'},
 {id:'einar',name:'Einar',series:'Vinland Saga',cost:44,skin:'#b97a53',hair:'#6b4423',hair2:'#3f2f25',style:'short',eye:'#78350f'},

 {id:'kaneki',name:'Kaneki',series:'Tokyo Ghoul',cost:26,skin:'#e4c0a5',hair:'#f1f5f9',hair2:'#cbd5e1',style:'messy',eye:'#dc2626',accessory:'eyepatch'},
 {id:'touka',name:'Touka',series:'Tokyo Ghoul',cost:32,skin:'#e6b794',hair:'#312e81',hair2:'#111827',style:'bob',eye:'#5b21b6'},
 {id:'juuzou',name:'Juuzou',series:'Tokyo Ghoul',cost:36,skin:'#efd0b4',hair:'#f8fafc',hair2:'#d1d5db',style:'messy',eye:'#dc2626',accessory:'stitches'},
 {id:'arima',name:'Arima',series:'Tokyo Ghoul',cost:40,skin:'#e6b996',hair:'#e5e7eb',hair2:'#cbd5e1',style:'short',eye:'#64748b',accessory:'glasses'},
 {id:'hide',name:'Hide',series:'Tokyo Ghoul',cost:46,skin:'#e7b895',hair:'#eab308',hair2:'#a16207',style:'short',eye:'#78350f'},
 {id:'phase2_kenzo_tenma',name:'Kenzo Tenma',series:'Monster',cost:35,skin:'#efd0b5',hair:'#111827',hair2:'#e2e8f0',style:'messy',eye:'#ca8a04',lookup:'Kenzo Tenma'},
 {id:'phase2_johan_liebert',name:'Johan Liebert',series:'Monster',cost:37,skin:'#dca77f',hair:'#7c3aed',hair2:'#b91c1c',style:'long',eye:'#e2e8f0',lookup:'Johan Liebert'},
 {id:'phase2_nina_fortner',name:'Nina Fortner',series:'Monster',cost:39,skin:'#d7a27d',hair:'#ca8a04',hair2:'#64748b',style:'short',eye:'#b91c1c',lookup:'Nina Fortner'},
 {id:'phase2_wolfgang_grimmer',name:'Wolfgang Grimmer',series:'Monster',cost:41,skin:'#efc7a6',hair:'#e2e8f0',hair2:'#075985',style:'swept',eye:'#64748b',lookup:'Wolfgang Grimmer'},
 {id:'phase2_shinichi_izumi',name:'Shinichi Izumi',series:'Parasyte – the Maxim',cost:43,skin:'#bb815d',hair:'#b91c1c',hair2:'#16a34a',style:'bob',eye:'#075985',lookup:'Shinichi Izumi'},
 {id:'phase2_migi',name:'Migi',series:'Parasyte – the Maxim',cost:45,skin:'#efd0b5',hair:'#64748b',hair2:'#111827',style:'spiky',eye:'#16a34a',lookup:'Migi'},
 {id:'phase2_kana_kimishima',name:'Kana Kimishima',series:'Parasyte – the Maxim',cost:47,skin:'#dca77f',hair:'#075985',hair2:'#7c3aed',style:'messy',eye:'#111827',lookup:'Kana Kimishima'},
 {id:'phase2_reiko_tamura',name:'Reiko Tamura',series:'Parasyte – the Maxim',cost:49,skin:'#d7a27d',hair:'#16a34a',hair2:'#ca8a04',style:'long',eye:'#7c3aed',lookup:'Reiko Tamura'},
 {id:'phase2_spike_spiegel',name:'Spike Spiegel',series:'Cowboy Bebop',cost:51,skin:'#efc7a6',hair:'#111827',hair2:'#e2e8f0',style:'short',eye:'#ca8a04',lookup:'Spike Spiegel'},
 {id:'phase2_faye_valentine',name:'Faye Valentine',series:'Cowboy Bebop',cost:53,skin:'#bb815d',hair:'#7c3aed',hair2:'#b91c1c',style:'swept',eye:'#e2e8f0',lookup:'Faye Valentine'},
 {id:'phase2_jet_black',name:'Jet Black',series:'Cowboy Bebop',cost:55,skin:'#efd0b5',hair:'#ca8a04',hair2:'#64748b',style:'bob',eye:'#b91c1c',lookup:'Jet Black'},
 {id:'phase2_edward_wong',name:'Edward Wong',series:'Cowboy Bebop',cost:57,skin:'#dca77f',hair:'#e2e8f0',hair2:'#075985',style:'spiky',eye:'#64748b',lookup:'Edward Wong'},
 {id:'phase2_shinji_ikari',name:'Shinji Ikari',series:'Neon Genesis Evangelion',cost:59,skin:'#d7a27d',hair:'#b91c1c',hair2:'#16a34a',style:'messy',eye:'#075985',lookup:'Shinji Ikari'},
 {id:'phase2_asuka_langley',name:'Asuka Langley',series:'Neon Genesis Evangelion',cost:61,skin:'#efc7a6',hair:'#64748b',hair2:'#111827',style:'long',eye:'#16a34a',lookup:'Asuka Langley'},
 {id:'phase2_rei_ayanami',name:'Rei Ayanami',series:'Neon Genesis Evangelion',cost:63,skin:'#bb815d',hair:'#075985',hair2:'#7c3aed',style:'short',eye:'#111827',lookup:'Rei Ayanami'},
 {id:'phase2_misato_katsuragi',name:'Misato Katsuragi',series:'Neon Genesis Evangelion',cost:65,skin:'#efd0b5',hair:'#16a34a',hair2:'#ca8a04',style:'swept',eye:'#7c3aed',lookup:'Misato Katsuragi'},
 {id:'phase2_kaworu_nagisa',name:'Kaworu Nagisa',series:'Neon Genesis Evangelion',cost:67,skin:'#dca77f',hair:'#111827',hair2:'#e2e8f0',style:'bob',eye:'#ca8a04',lookup:'Kaworu Nagisa'},
 {id:'phase2_edward_elric',name:'Edward Elric',series:'Fullmetal Alchemist',cost:69,skin:'#d7a27d',hair:'#7c3aed',hair2:'#b91c1c',style:'spiky',eye:'#e2e8f0',lookup:'Edward Elric'},
 {id:'phase2_alphonse_elric',name:'Alphonse Elric',series:'Fullmetal Alchemist',cost:71,skin:'#efc7a6',hair:'#ca8a04',hair2:'#64748b',style:'messy',eye:'#b91c1c',lookup:'Alphonse Elric'},
 {id:'phase2_roy_mustang',name:'Roy Mustang',series:'Fullmetal Alchemist',cost:73,skin:'#bb815d',hair:'#e2e8f0',hair2:'#075985',style:'long',eye:'#64748b',lookup:'Roy Mustang'},
 {id:'phase2_riza_hawkeye',name:'Riza Hawkeye',series:'Fullmetal Alchemist',cost:75,skin:'#efd0b5',hair:'#b91c1c',hair2:'#16a34a',style:'short',eye:'#075985',lookup:'Riza Hawkeye'},
 {id:'phase2_scar',name:'Scar',series:'Fullmetal Alchemist',cost:77,skin:'#dca77f',hair:'#64748b',hair2:'#111827',style:'swept',eye:'#16a34a',lookup:'Scar'},
 {id:'phase2_gon_freecss',name:'Gon Freecss',series:'Hunter x Hunter',cost:79,skin:'#d7a27d',hair:'#075985',hair2:'#7c3aed',style:'bob',eye:'#111827',lookup:'Gon Freecss'},
 {id:'phase2_killua_zoldyck',name:'Killua Zoldyck',series:'Hunter x Hunter',cost:81,skin:'#efc7a6',hair:'#16a34a',hair2:'#ca8a04',style:'spiky',eye:'#7c3aed',lookup:'Killua Zoldyck'},
 {id:'phase2_kurapika',name:'Kurapika',series:'Hunter x Hunter',cost:83,skin:'#bb815d',hair:'#111827',hair2:'#e2e8f0',style:'messy',eye:'#ca8a04',lookup:'Kurapika'},
 {id:'phase2_hisoka_morow',name:'Hisoka Morow',series:'Hunter x Hunter',cost:85,skin:'#efd0b5',hair:'#7c3aed',hair2:'#b91c1c',style:'long',eye:'#e2e8f0',lookup:'Hisoka Morow'},
 {id:'phase2_chrollo_lucilfer',name:'Chrollo Lucilfer',series:'Hunter x Hunter',cost:87,skin:'#dca77f',hair:'#ca8a04',hair2:'#64748b',style:'short',eye:'#b91c1c',lookup:'Chrollo Lucilfer'},
 {id:'phase2_denji',name:'Denji',series:'Chainsaw Man',cost:89,skin:'#d7a27d',hair:'#e2e8f0',hair2:'#075985',style:'swept',eye:'#64748b',lookup:'Denji'},
 {id:'phase2_power',name:'Power',series:'Chainsaw Man',cost:91,skin:'#efc7a6',hair:'#b91c1c',hair2:'#16a34a',style:'bob',eye:'#075985',lookup:'Power'},
 {id:'phase2_aki_hayakawa',name:'Aki Hayakawa',series:'Chainsaw Man',cost:93,skin:'#bb815d',hair:'#64748b',hair2:'#111827',style:'spiky',eye:'#16a34a',lookup:'Aki Hayakawa'},
 {id:'phase2_makima',name:'Makima',series:'Chainsaw Man',cost:95,skin:'#efd0b5',hair:'#075985',hair2:'#7c3aed',style:'messy',eye:'#111827',lookup:'Makima'},
 {id:'phase2_kobeni_higashiyama',name:'Kobeni Higashiyama',series:'Chainsaw Man',cost:97,skin:'#dca77f',hair:'#16a34a',hair2:'#ca8a04',style:'long',eye:'#7c3aed',lookup:'Kobeni Higashiyama'},
 {id:'phase2_kafka_hibino',name:'Kafka Hibino',series:'Kaiju No. 8',cost:99,skin:'#d7a27d',hair:'#111827',hair2:'#e2e8f0',style:'short',eye:'#ca8a04',lookup:'Kafka Hibino'},
 {id:'phase2_mina_ashiro',name:'Mina Ashiro',series:'Kaiju No. 8',cost:101,skin:'#efc7a6',hair:'#7c3aed',hair2:'#b91c1c',style:'swept',eye:'#e2e8f0',lookup:'Mina Ashiro'},
 {id:'phase2_kikoru_shinomiya',name:'Kikoru Shinomiya',series:'Kaiju No. 8',cost:103,skin:'#bb815d',hair:'#ca8a04',hair2:'#64748b',style:'bob',eye:'#b91c1c',lookup:'Kikoru Shinomiya'},
 {id:'phase2_reno_ichikawa',name:'Reno Ichikawa',series:'Kaiju No. 8',cost:105,skin:'#efd0b5',hair:'#e2e8f0',hair2:'#075985',style:'spiky',eye:'#64748b',lookup:'Reno Ichikawa'},
 {id:'phase2_soshiro_hoshina',name:'Soshiro Hoshina',series:'Kaiju No. 8',cost:107,skin:'#dca77f',hair:'#b91c1c',hair2:'#16a34a',style:'messy',eye:'#075985',lookup:'Soshiro Hoshina'},
 {id:'phase2_loid_forger',name:'Loid Forger',series:'Spy x Family',cost:109,skin:'#d7a27d',hair:'#64748b',hair2:'#111827',style:'long',eye:'#16a34a',lookup:'Loid Forger'},
 {id:'phase2_yor_forger',name:'Yor Forger',series:'Spy x Family',cost:111,skin:'#efc7a6',hair:'#075985',hair2:'#7c3aed',style:'short',eye:'#111827',lookup:'Yor Forger'},
 {id:'phase2_anya_forger',name:'Anya Forger',series:'Spy x Family',cost:113,skin:'#bb815d',hair:'#16a34a',hair2:'#ca8a04',style:'swept',eye:'#7c3aed',lookup:'Anya Forger'},
 {id:'phase2_fiona_frost',name:'Fiona Frost',series:'Spy x Family',cost:115,skin:'#efd0b5',hair:'#111827',hair2:'#e2e8f0',style:'bob',eye:'#ca8a04',lookup:'Fiona Frost'},
 {id:'phase2_kiyotaka_ayanokoji',name:'Kiyotaka Ayanokoji',series:'Classroom of the Elite',cost:117,skin:'#dca77f',hair:'#7c3aed',hair2:'#b91c1c',style:'spiky',eye:'#e2e8f0',lookup:'Kiyotaka Ayanokoji'},
 {id:'phase2_suzune_horikita',name:'Suzune Horikita',series:'Classroom of the Elite',cost:119,skin:'#d7a27d',hair:'#ca8a04',hair2:'#64748b',style:'messy',eye:'#b91c1c',lookup:'Suzune Horikita'},
 {id:'phase2_kei_karuizawa',name:'Kei Karuizawa',series:'Classroom of the Elite',cost:121,skin:'#efc7a6',hair:'#e2e8f0',hair2:'#075985',style:'long',eye:'#64748b',lookup:'Kei Karuizawa'},
 {id:'phase2_kakeru_ryuen',name:'Kakeru Ryuen',series:'Classroom of the Elite',cost:123,skin:'#bb815d',hair:'#b91c1c',hair2:'#16a34a',style:'short',eye:'#075985',lookup:'Kakeru Ryuen'},
 {id:'phase2_honami_ichinose',name:'Honami Ichinose',series:'Classroom of the Elite',cost:125,skin:'#efd0b5',hair:'#64748b',hair2:'#111827',style:'swept',eye:'#16a34a',lookup:'Honami Ichinose'},
 {id:'phase2_aqua_hoshino',name:'Aqua Hoshino',series:'Oshi no Ko',cost:127,skin:'#dca77f',hair:'#075985',hair2:'#7c3aed',style:'bob',eye:'#111827',lookup:'Aqua Hoshino'},
 {id:'phase2_ruby_hoshino',name:'Ruby Hoshino',series:'Oshi no Ko',cost:129,skin:'#d7a27d',hair:'#16a34a',hair2:'#ca8a04',style:'spiky',eye:'#7c3aed',lookup:'Ruby Hoshino'},
 {id:'phase2_kana_arima',name:'Kana Arima',series:'Oshi no Ko',cost:131,skin:'#efc7a6',hair:'#111827',hair2:'#e2e8f0',style:'messy',eye:'#ca8a04',lookup:'Kana Arima'},
 {id:'phase2_akane_kurokawa',name:'Akane Kurokawa',series:'Oshi no Ko',cost:133,skin:'#bb815d',hair:'#7c3aed',hair2:'#b91c1c',style:'long',eye:'#e2e8f0',lookup:'Akane Kurokawa'},
 {id:'phase2_ai_hoshino',name:'Ai Hoshino',series:'Oshi no Ko',cost:135,skin:'#efd0b5',hair:'#ca8a04',hair2:'#64748b',style:'short',eye:'#b91c1c',lookup:'Ai Hoshino'},
 {id:'phase2_takemichi_hanagaki',name:'Takemichi Hanagaki',series:'Tokyo Revengers',cost:137,skin:'#dca77f',hair:'#e2e8f0',hair2:'#075985',style:'swept',eye:'#64748b',lookup:'Takemichi Hanagaki'},
 {id:'phase2_manjiro_sano',name:'Manjiro Sano',series:'Tokyo Revengers',cost:139,skin:'#d7a27d',hair:'#b91c1c',hair2:'#16a34a',style:'bob',eye:'#075985',lookup:'Manjiro Sano'},
 {id:'phase2_ken_ryuguji',name:'Ken Ryuguji',series:'Tokyo Revengers',cost:141,skin:'#efc7a6',hair:'#64748b',hair2:'#111827',style:'spiky',eye:'#16a34a',lookup:'Ken Ryuguji'},
 {id:'phase2_chifuyu_matsuno',name:'Chifuyu Matsuno',series:'Tokyo Revengers',cost:143,skin:'#bb815d',hair:'#075985',hair2:'#7c3aed',style:'messy',eye:'#111827',lookup:'Chifuyu Matsuno'},
 {id:'phase2_keisuke_baji',name:'Keisuke Baji',series:'Tokyo Revengers',cost:145,skin:'#efd0b5',hair:'#16a34a',hair2:'#ca8a04',style:'long',eye:'#7c3aed',lookup:'Keisuke Baji'},
 {id:'phase2_haruka_sakura',name:'Haruka Sakura',series:'Wind Breaker',cost:147,skin:'#dca77f',hair:'#111827',hair2:'#e2e8f0',style:'short',eye:'#ca8a04',lookup:'Haruka Sakura'},
 {id:'phase2_hayato_suo',name:'Hayato Suo',series:'Wind Breaker',cost:149,skin:'#d7a27d',hair:'#7c3aed',hair2:'#b91c1c',style:'swept',eye:'#e2e8f0',lookup:'Hayato Suo'},
 {id:'phase2_akihiko_nirei',name:'Akihiko Nirei',series:'Wind Breaker',cost:151,skin:'#efc7a6',hair:'#ca8a04',hair2:'#64748b',style:'bob',eye:'#b91c1c',lookup:'Akihiko Nirei'},
 {id:'phase2_hajime_umemiya',name:'Hajime Umemiya',series:'Wind Breaker',cost:153,skin:'#bb815d',hair:'#e2e8f0',hair2:'#075985',style:'spiky',eye:'#64748b',lookup:'Hajime Umemiya'},
 {id:'phase2_jo_togame',name:'Jo Togame',series:'Wind Breaker',cost:155,skin:'#efd0b5',hair:'#b91c1c',hair2:'#16a34a',style:'messy',eye:'#075985',lookup:'Jo Togame'},
 {id:'phase2_sung_jinwoo',name:'Sung Jinwoo',series:'Solo Leveling',cost:155,skin:'#dca77f',hair:'#64748b',hair2:'#111827',style:'long',eye:'#16a34a',lookup:'Sung Jinwoo'},
 {id:'phase2_cha_hae_in',name:'Cha Hae-In',series:'Solo Leveling',cost:155,skin:'#d7a27d',hair:'#075985',hair2:'#7c3aed',style:'short',eye:'#111827',lookup:'Cha Hae-In'},
 {id:'phase2_igris',name:'Igris',series:'Solo Leveling',cost:155,skin:'#efc7a6',hair:'#16a34a',hair2:'#ca8a04',style:'swept',eye:'#7c3aed',lookup:'Igris'},
 {id:'phase2_beru',name:'Beru',series:'Solo Leveling',cost:155,skin:'#bb815d',hair:'#111827',hair2:'#e2e8f0',style:'bob',eye:'#ca8a04',lookup:'Beru'},
 {id:'phase2_yoo_jinho',name:'Yoo Jinho',series:'Solo Leveling',cost:155,skin:'#efd0b5',hair:'#7c3aed',hair2:'#b91c1c',style:'spiky',eye:'#e2e8f0',lookup:'Yoo Jinho'}
];

// Transparent character tiers: protagonists/recognisable leads cost 40–50,
// supporting characters 30–40. The starter character stays free.
const MAIN_CHARACTER_IDS=new Set(["light","eren","isagi","yuji","gojo","subaru","klein","dokja","joonghyuk","thorfinn","kaneki","phase2_kenzo_tenma","phase2_johan_liebert","phase2_shinichi_izumi","phase2_spike_spiegel","phase2_shinji_ikari","phase2_edward_elric","phase2_gon_freecss","phase2_denji","phase2_kafka_hibino","phase2_loid_forger","phase2_anya_forger","phase2_kiyotaka_ayanokoji","phase2_aqua_hoshino","phase2_takemichi_hanagaki","phase2_manjiro_sano","phase2_haruka_sakura","phase2_sung_jinwoo","lelouch"]);
const POPULAR_LEAD_IDS=new Set(["light","eren","gojo","isagi","yuji","kaneki","phase2_sung_jinwoo","phase2_denji","phase2_anya_forger","phase2_edward_elric","phase2_gon_freecss"]);
// Accessible World shop pricing. Older owned IDs and earned balances
// are preserved; only the next unowned purchase uses this price.
CHARACTERS.forEach(c=>{
 if(c.id==='lelouch'){c.cost=0;return}
 c.cost=POPULAR_LEAD_IDS.has(c.id)?20:MAIN_CHARACTER_IDS.has(c.id)?15:10;
});

const OUTFIT_STYLES=[
 {id:'default',name:'Default',cost:0,top:'#2563eb',accent:'#dbeafe'},
 {id:'hoodie',name:'Hoodie',cost:12,top:'#0f172a',accent:'#64748b'},
 {id:'casual',name:'Casual',cost:16,top:'#16a34a',accent:'#dcfce7'},
 {id:'winter',name:'Winter',cost:20,top:'#7c3aed',accent:'#ede9fe'},
 {id:'smart',name:'Smart',cost:24,top:'#334155',accent:'#e2e8f0'},
 {id:'traveller',name:'Traveller',cost:28,top:'#b45309',accent:'#fef3c7'},
 {id:'sport',name:'Sport',cost:32,top:'#dc2626',accent:'#fee2e2'},
 {id:'festival',name:'Festival',cost:38,top:'#db2777',accent:'#fce7f3'}
];
const CHARACTER_OUTFIT_NAMES={
 lelouch:['Academy Uniform','Black Knight Cloak','Ashford Casual','Royal Uniform','Zero-Inspired Costume','Winter Coat','Ceremonial Jacket','Midnight Regalia'],
 light:['School Uniform','Smart Suit','Casual Jacket','Dark Overcoat','Formal Shirt','Winter Coat','Student Casual','Detective Look'],
 eren:['Cadet Uniform','Scout Cloak','Casual Shirt','Long Coat','Field Jacket','Winter Cloak','Formal Jacket','Survey Expedition'],
 isagi:['Training Kit','Blue Match Kit','Tracksuit','Casual Jacket','Winter Training','Streetwear','Away Kit','Final-Match Kit'],
 gojo:['High-Collar Uniform','Travel Coat','Casual T-shirt','Dark Overcoat','Winter Coat','Ceremonial Jacket','City Clothes','Battle Outfit'],
 subaru:['Tracksuit','Traveller Coat','Casual Jacket','Winter Cloak','Smart Look','Training Clothes','Summer Outfit','Knight-Inspired Attire'],
 klein:['Formal Suit','Seer Attire','Long Trench Coat','Gentleman Outfit','Black Overcoat','Traveller Clothes','Mystic Robes','Ceremonial Dress'],
 dokja:['Office Attire','Dark Coat','Casual Jumper','Scenario Outfit','Winter Jacket','Formal Outfit','Traveller Gear','Starlit Cloak'],
 thorfinn:['Traveller Tunic','Explorer Cloak','Casual Linen','Cold-Weather Cloak','Workwear','Warrior Garb','Farm Outfit','Long Voyage'],
 kaneki:['Casual Shirt','Black Coat','White-Hair Outfit','Student Look','Winter Jacket','Long Overcoat','Battle Gear','Midnight Mask']
};
const SERIES_OUTFIT_NAMES={
 'Code Geass':['Academy Look','Black Knights Outfit','Casual Jacket','Military Uniform','Royal Attire','Winter Coat','Formal Uniform','Ceremonial Style'],
 'Death Note':['School Clothes','Investigation Outfit','Casual Jacket','Smart Suit','Dark Overcoat','Winter Wear','Formal Shirt','Late-Night Outfit'],
 'Attack on Titan':['Cadet Clothes','Scout Cloak','Everyday Clothes','Training Uniform','Cold-Weather Cloak','Survey Jacket','Formal Clothes','Expedition Gear'],
 'Blue Lock':['Training Kit','Match Kit','Tracksuit','Casual Clothes','Winter Training','Streetwear','Away Kit','Tournament Kit'],
 'Jujutsu Kaisen':['Sorcerer Uniform','Mission Attire','Casual Clothes','Dark Overcoat','Cold-Weather Outfit','Ceremonial Jacket','City Clothes','Battle Gear'],
 'Re:Zero':['Everyday Outfit','Traveller Clothing','Casual Jacket','Winter Cloak','Court Clothes','Adventurer Outfit','Summer Clothes','Knight-Inspired Gear'],
 'Lord of the Mysteries':['Formal Clothes','Mystic Outfit','Long Trench Coat','Gentleman Outfit','Black Overcoat','Traveller Suit','Ritual Robes','Ceremonial Dress'],
 'Omniscient Reader':['Everyday Outfit','Scenario Outfit','Office Attire','Dark Overcoat','Winter Jacket','Formal Wear','Traveller Gear','Starlit Cloak'],
 'Vinland Saga':['Traveller Tunic','Seafarer Outfit','Casual Linen','Cold-Weather Cloak','Workwear','Warrior Garb','Farm Clothes','Long-Voyage Cloak'],
 'Tokyo Ghoul':['Everyday Clothes','Investigator-Inspired Look','Dark Coat','Student Clothes','Winter Jacket','Long Overcoat','Night Gear','Midnight Disguise']
};
const OUTFITS=CHARACTERS.flatMap(ch=>OUTFIT_STYLES.map((o,i)=>({
 id:ch.id+'-'+o.id,character:ch.id,name:(CHARACTER_OUTFIT_NAMES[ch.id]||SERIES_OUTFIT_NAMES[ch.series]||[])[i]||o.name,
 cost:i===0?0:5,
 top:o.top,accent:o.accent,styleId:o.id
})));

// Read-only official character-profile previews. The artwork is linked from MyAnimeList via Jikan;
// nothing is downloaded or redistributed into this public repository.
const ANIME_ART_QUERY={
 lelouch:'Lelouch Lamperouge',cc:'C.C.',light:'Light Yagami',l:'L Lawliet',eren:'Eren Yeager',
 rin_bl:'Rin Itoshi',isagi:'Yoichi Isagi',yuji:'Yuji Itadori',gojo:'Satoru Gojou',
 megumi:'Megumi Fushiguro',nobara:'Nobara Kugisaki',subaru:'Subaru Natsuki',
 klein:'Klein Moretti',dokja:'Kim Dokja',joonghyuk:'Yoo Joonghyuk',thorfinn:'Thorfinn',
 kaneki:'Ken Kaneki',touka:'Touka Kirishima',juuzou:'Juuzou Suzuya',
 phase2_sung_jinwoo:'Sung Jinwoo',phase2_kafka_hibino:'Kafka Hibino',phase2_shinichi_izumi:'Shinichi Izumi',
 phase2_kenzo_tenma:'Kenzo Tenma',phase2_johan_liebert:'Johan Liebert',
 phase2_kiyotaka_ayanokoji:'Kiyotaka Ayanokouji',phase2_manjiro_sano:'Manjiro Sano',
 phase2_aqua_hoshino:'Aqua Hoshino'
};
const VERIFIED_CHARACTER_IMAGE_URLS={
  "lelouch": "https://cdn.myanimelist.net/images/characters/8/406163.jpg",
  "light": "https://cdn.myanimelist.net/images/characters/6/63870.jpg",
  "l": "https://cdn.myanimelist.net/images/characters/10/249647.jpg",
  "eren": "https://cdn.myanimelist.net/images/characters/10/216895.jpg",
  "mikasa": "https://cdn.myanimelist.net/images/characters/9/215563.jpg",
  "levi": "https://cdn.myanimelist.net/images/characters/2/241413.jpg",
  "erwin": "https://cdn.myanimelist.net/images/characters/14/559023.jpg",
  "gojo": "https://cdn.myanimelist.net/images/characters/15/422168.jpg",
  "subaru": "https://cdn.myanimelist.net/images/characters/15/315153.jpg",
  "emilia": "https://cdn.myanimelist.net/images/characters/16/551926.jpg",
  "rem": "https://cdn.myanimelist.net/images/characters/9/311327.jpg",
  "thorfinn": "https://cdn.myanimelist.net/images/characters/9/309871.jpg",
  "askeladd": "https://cdn.myanimelist.net/images/characters/14/401940.jpg",
  "kaneki": "https://cdn.myanimelist.net/images/characters/15/307255.jpg",
  "phase2_johan_liebert": "https://cdn.myanimelist.net/images/characters/4/316522.jpg",
  "phase2_spike_spiegel": "https://cdn.myanimelist.net/images/characters/11/516853.jpg",
  "phase2_edward_elric": "https://cdn.myanimelist.net/images/characters/9/72533.jpg",
  "phase2_roy_mustang": "https://cdn.myanimelist.net/images/characters/11/510227.jpg",
  "phase2_killua_zoldyck": "https://cdn.myanimelist.net/images/characters/2/327920.jpg",
  "phase2_kurapika": "https://cdn.myanimelist.net/images/characters/3/549312.jpg",
  "phase2_hisoka_morow": "https://cdn.myanimelist.net/images/characters/3/174561.jpg"
};

/* Optional personal outfit images. These are saved in IndexedDB on this device,
   never uploaded to GitHub, Vercel, Jikan or an image host. Existing unlock
   identifiers are unchanged, so the shop's purchase history is preserved. */
const outfitImageCache=new Map();
let outfitDbPromise=null;
function getOutfitImageDb(){
 if(outfitDbPromise)return outfitDbPromise;
 if(typeof indexedDB==='undefined')return Promise.resolve(null);
 outfitDbPromise=new Promise(resolve=>{
  try{
   const req=indexedDB.open('revision-loop-personal-outfit-art',1);
   req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('art'))req.result.createObjectStore('art')};
   req.onsuccess=()=>resolve(req.result);
   req.onerror=()=>resolve(null);
   req.onblocked=()=>resolve(null);
  }catch{resolve(null)}
 });
 return outfitDbPromise;
}
async function savedOutfitImage(id){
 if(outfitImageCache.has(id))return outfitImageCache.get(id);
 const db=await getOutfitImageDb();
 if(!db)return null;
 const data=await new Promise(resolve=>{
  try{
   const tx=db.transaction('art','readonly'),rq=tx.objectStore('art').get(id);
   rq.onsuccess=()=>resolve(rq.result||null);
   rq.onerror=()=>resolve(null);
  }catch{resolve(null)}
 });
 outfitImageCache.set(id,data);
 return data;
}
async function setSavedOutfitImage(id,data){
 const db=await getOutfitImageDb();
 if(!db)throw Error('Your browser does not support local outfit-picture storage.');
 await new Promise((resolve,reject)=>{
  try{
   const tx=db.transaction('art','readwrite');
   tx.oncomplete=resolve;
   tx.onerror=()=>reject(Error('Cannot save the image in this browser.'));
   if(data)tx.objectStore('art').put(data,id);else tx.objectStore('art').delete(id);
  }catch(error){reject(error)}
 });
 outfitImageCache.set(id,data||null);
}
const SERIES_COSTUME_TONES=Object.freeze({
  "Code Geass": [
    "#222a4a",
    "#c8a860"
  ],
  "Death Note": [
    "#242b3b",
    "#b9c5d8"
  ],
  "Attack on Titan": [
    "#415446",
    "#d7bd83"
  ],
  "Blue Lock": [
    "#16356a",
    "#7fd0e5"
  ],
  "Jujutsu Kaisen": [
    "#233044",
    "#ab9ce7"
  ],
  "Re:Zero": [
    "#514176",
    "#e9d8c1"
  ],
  "Lord of the Mysteries": [
    "#312e4a",
    "#c7b087"
  ],
  "Omniscient Reader": [
    "#202c3d",
    "#88a5ce"
  ],
  "Vinland Saga": [
    "#554532",
    "#dcc39b"
  ],
  "Tokyo Ghoul": [
    "#25222c",
    "#c35570"
  ],
  "Monster": [
    "#3a404b",
    "#c7b09b"
  ],
  "Parasyte – the Maxim": [
    "#3e5250",
    "#bfd3ce"
  ],
  "Cowboy Bebop": [
    "#263a56",
    "#e7bb74"
  ],
  "Neon Genesis Evangelion": [
    "#43305d",
    "#b8df6f"
  ],
  "Fullmetal Alchemist": [
    "#4b3038",
    "#d8b18e"
  ],
  "Hunter x Hunter": [
    "#314b39",
    "#d1cb8b"
  ],
  "Chainsaw Man": [
    "#3a3d47",
    "#eac8a8"
  ],
  "Kaiju No. 8": [
    "#284b55",
    "#b1ced5"
  ],
  "Spy x Family": [
    "#345b50",
    "#ddc8a8"
  ],
  "Classroom of the Elite": [
    "#273e61",
    "#a8c4e3"
  ],
  "Oshi no Ko": [
    "#492f59",
    "#dfb5df"
  ],
  "Tokyo Revengers": [
    "#242938",
    "#c7b78c"
  ],
  "Wind Breaker": [
    "#31525a",
    "#b5d1ce"
  ],
  "Solo Leveling": [
    "#292a51",
    "#9a8cff"
  ]
});

function outfitPalette(c,o){
 const base={coat:o?.top||'#243858',trim:o?.accent||'#dce9fc'};
 // Character-specific accents remain for the five central leads; every
 // other series now has its own recognisable colour family rather than
 // all 111 remaining characters sharing the same eight generic palettes.
 const special={
  "lelouch": [
    [
      "#153269",
      "#efcf83"
    ],
    [
      "#181421",
      "#bb1f32"
    ],
    [
      "#243a67",
      "#f2f2ed"
    ],
    [
      "#f6f4e9",
      "#c6a34c"
    ],
    [
      "#11121b",
      "#cf172d"
    ],
    [
      "#222d4b",
      "#d0d8ef"
    ],
    [
      "#f0ede6",
      "#be9a4a"
    ],
    [
      "#201625",
      "#b90c2d"
    ]
  ],
  "light": [
    [
      "#455f88",
      "#e8e7e2"
    ],
    [
      "#333c4c",
      "#ced0d4"
    ],
    [
      "#6b4b3e",
      "#d5b198"
    ],
    [
      "#191f2c",
      "#8d94a8"
    ],
    [
      "#f9f9f6",
      "#4b596e"
    ],
    [
      "#34465f",
      "#a0b8d5"
    ],
    [
      "#8a7270",
      "#f2f0ec"
    ],
    [
      "#252d35",
      "#a1a1aa"
    ]
  ],
  "eren": [
    [
      "#8c6f52",
      "#d0b69a"
    ],
    [
      "#47715b",
      "#d9d5bd"
    ],
    [
      "#dad3c2",
      "#837261"
    ],
    [
      "#222b35",
      "#8a7766"
    ],
    [
      "#405c4c",
      "#d4a779"
    ],
    [
      "#5b5544",
      "#d1b996"
    ],
    [
      "#595f67",
      "#d9d6ce"
    ],
    [
      "#38644f",
      "#d7d6cd"
    ]
  ],
  "gojo": [
    [
      "#151d35",
      "#a8c2ff"
    ],
    [
      "#242944",
      "#cacad5"
    ],
    [
      "#eceae7",
      "#324059"
    ],
    [
      "#19141e",
      "#8f7ac1"
    ],
    [
      "#474f65",
      "#d3d7e4"
    ],
    [
      "#f5f3f0",
      "#8a95af"
    ],
    [
      "#202e4c",
      "#b0c7e7"
    ],
    [
      "#1b1835",
      "#b4aaff"
    ]
  ],
  "kaneki": [
    [
      "#202632",
      "#e8e8eb"
    ],
    [
      "#161520",
      "#c82e3f"
    ],
    [
      "#20232a",
      "#d0d1d4"
    ],
    [
      "#767d87",
      "#d1d1d4"
    ],
    [
      "#262638",
      "#b83d54"
    ],
    [
      "#14141e",
      "#f4f2f2"
    ],
    [
      "#14171c",
      "#ac242d"
    ],
    [
      "#211b25",
      "#f5e5ee"
    ]
  ]
};
 const index=Math.max(0,OUTFIT_STYLES.findIndex(x=>x.id===o?.styleId));
 const tuned=special[c?.id]?.[index];
 if(tuned)return {coat:tuned[0],trim:tuned[1]};
 const pair=SERIES_COSTUME_TONES[c?.series];
 if(!pair)return base;
 const seriesStyles=[
  [pair[0],pair[1]],
  [pair[0],base.trim],
  [base.coat,pair[1]],
  [pair[0],base.trim],
  [pair[0],pair[1]],
  [base.coat,pair[1]],
  [pair[0],base.trim],
  [base.coat,pair[1]]
 ];
 return {coat:seriesStyles[index][0],trim:seriesStyles[index][1]};
}
function costumeStyleDetails(style,p){
 // Each wardrobe slot changes the actual clothing silhouette, not only
 // its hue. This is original conceptual SVG art, NOT official anime art.
 const trim=esc(p.trim),coat=esc(p.coat);
 const details={
  default:'<path d="M71 43 L120 70 169 43 M105 83 H135" fill="none" stroke="'+trim+'" stroke-width="3"/><path d="M157 68 L174 76 161 91 147 84Z" fill="'+trim+'" opacity=".75"/>',
  hoodie:'<path d="M66 47 Q73 18 120 31 Q167 18 174 47 L157 61 Q120 39 83 61Z" fill="'+coat+'" stroke="'+trim+'" stroke-width="4"/><path d="M82 102 Q120 93 158 102 L158 116 H82Z" fill="'+trim+'" opacity=".22"/><path d="M113 59 L110 94 M127 59 L130 94" stroke="'+trim+'" stroke-width="3"/>',
  casual:'<path d="M54 64 L73 58 L77 91 L58 98Z M186 64 L167 58 L163 91 L182 98Z" fill="'+trim+'" opacity=".33"/><path d="M117 60 V114 M136 91 L163 91" stroke="'+trim+'" stroke-width="3"/><path d="M153 69 H173 V80 H153Z" fill="none" stroke="'+trim+'" stroke-width="2"/>',
  winter:'<path d="M73 43 Q44 52 16 78 L-2 116 H89 L99 45 Z M167 43 Q197 52 224 78 L242 116 H151 L140 45Z" fill="'+coat+'" stroke="'+trim+'" stroke-width="3"/><path d="M82 40 Q120 70 158 40 L169 56 Q120 89 71 56Z" fill="'+trim+'" opacity=".78"/><path d="M115 78 H125 M115 97 H125" stroke="'+trim+'" stroke-width="5"/>',
  smart:'<path d="M70 37 L118 70 102 92 87 76 70 101 61 61Z M170 37 L122 70 138 92 153 76 170 101 179 61Z" fill="'+trim+'" opacity=".92" stroke="'+coat+'" stroke-width="3"/><path d="M113 64 L127 64 122 82 133 116 H107 L118 82Z" fill="'+coat+'" stroke="'+trim+'" stroke-width="2"/><circle cx="95" cy="94" r="3" fill="'+trim+'"/><circle cx="145" cy="94" r="3" fill="'+trim+'"/>',
  traveller:'<path d="M44 42 Q77 54 100 83 L108 116 H-6 V90 Q21 53 44 42Z M196 42 Q166 54 140 83 L132 116 H246 V90 Q219 53 196 42Z" fill="'+coat+'" stroke="'+trim+'" stroke-width="2"/><path d="M92 38 Q145 71 183 49 L164 74 Q130 91 99 71Z" fill="'+trim+'" opacity=".83"/><path d="M170 42 L89 116" stroke="'+trim+'" stroke-width="6" opacity=".6"/>',
  sport:'<path d="M42 56 L70 43 88 48 62 81 42 75Z M198 56 L170 43 152 48 178 81 198 75Z" fill="'+trim+'" opacity=".9"/><path d="M120 56 V116 M111 77 H129" stroke="'+trim+'" stroke-width="3"/><path d="M65 94 H87 M153 94 H175" stroke="'+trim+'" stroke-width="5"/><circle cx="161" cy="75" r="9" fill="none" stroke="'+trim+'" stroke-width="2"/>',
  festival:'<path d="M41 56 L66 35 87 47 62 71Z M199 56 L174 35 153 47 178 71Z" fill="'+trim+'" opacity=".85"/><path d="M72 44 L170 112" stroke="'+trim+'" stroke-width="11" opacity=".75"/><path d="M74 41 L172 109" stroke="'+coat+'" stroke-width="3"/><path d="M112 72 L120 82 128 72 124 88 140 93 124 96 120 110 116 96 100 93 116 88Z" fill="'+trim+'"/>'
 };
 return details[style]||details.default;
}
function costumeCharacterDetail(c,p){
 // Small non-official motifs reflect a character's colour/wardrobe identity.
 const accent=esc(p.trim);
 const motifs={
  lelouch:'<path d="M182 79 Q197 61 212 79 Q197 89 182 79Z" fill="'+accent+'" opacity=".92"/>',
  eren:'<path d="M177 72 L203 72 203 92 190 99 177 92Z" fill="none" stroke="'+accent+'" stroke-width="2"/><path d="M182 87 L190 76 198 87" fill="none" stroke="'+accent+'" stroke-width="2"/>',
  mikasa:'<path d="M75 33 Q108 62 150 33 L144 52 Q111 80 81 55Z" fill="#9a252a" opacity=".94"/>',
  gojo:'<path d="M181 75 L191 65 201 75 191 85Z" fill="'+accent+'" opacity=".7"/>',
  kaneki:'<path d="M183 74 L196 66 201 80 194 94 182 86Z" fill="none" stroke="'+accent+'" stroke-width="2.4"/>',
  light:'<path d="M188 70 L198 70 198 88 188 88Z" fill="'+accent+'" opacity=".8"/>'
 };
 return motifs[c?.id]||'';
}
function illustratedCostume(c,o){
 if(!o)return '';
 const p=outfitPalette(c,o),style=String(o.styleId||'default');
 return '<svg class="costume-silhouette costume-'+esc(style)+'" viewBox="0 0 240 116" preserveAspectRatio="none" aria-hidden="true" style="--coat:'+esc(p.coat)+';--trim:'+esc(p.trim)+'">'+
  '<path class="costume-shoulders" d="M-7 116V74Q13 54 69 39L95 32 120 59 145 32 171 39Q227 54 247 74V116Z"/>'+
  '<path class="costume-inner" d="M95 32L120 59 145 32 136 116H104Z"/>'+
  '<path class="costume-lapel left" d="M69 39L95 32 120 59 98 78 81 65Z"/>'+
  '<path class="costume-lapel right" d="M171 39L145 32 120 59 142 78 159 65Z"/>'+
  '<path class="costume-centre" d="M119 58V116"/>'+
  '<path class="costume-detail" d="M31 85L69 64 M209 85L171 64"/>'+
  '<path class="costume-scarf" d="M86 39Q120 72 154 39L141 64 126 73 136 116 111 116 112 73Z"/>'+
  '<g class="outfit-garment-details outfit-garment-'+esc(style)+'">'+costumeStyleDetails(style,p)+'</g>'+
  costumeCharacterDetail(c,p)+
  '</svg>';
}
function compressOutfitPhoto(file){
 return new Promise((resolve,reject)=>{
  if(!/^image\/(png|jpeg|webp)$/i.test(file?.type||'')){reject(Error('Choose a JPG, PNG or WebP picture.'));return}
  if(file.size>7_000_000){reject(Error('Choose an image smaller than 7 MB.'));return}
  const url=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{
   try{
    const canvas=document.createElement('canvas'),long=Math.max(img.naturalWidth,img.naturalHeight);
    const ratio=Math.min(1,460/long);
    canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));
    canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));
    const ctx=canvas.getContext('2d');
    if(!ctx)throw Error('Photo editing is unavailable.');
    ctx.fillStyle='#0f172a';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const data=canvas.toDataURL('image/jpeg',0.80);
    if(data.length>550_000)throw Error('This picture is too large after compression.');
    resolve(data);
   }catch(error){reject(error)}
   finally{URL.revokeObjectURL(url)}
  };
  img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('That picture cannot be opened.'))};
  img.src=url;
 });
}

// Cache only public portrait URLs on this device (never the image files).
// URLs can expire, so failing links are discarded and resolved again.
const PORTRAIT_URL_KEY='revision-loop-portrait-url-v1:';
function validPortraitUrl(url){
 try{
  const u=new URL(url);
  return u.protocol==='https:'&&/^(?:s[34]\.anilist\.co|cdn\.myanimelist\.net)$/i.test(u.hostname);
 }catch{return false}
}
function cachedPortraitUrl(id){
 try{
  const saved=JSON.parse(localStorage.getItem(PORTRAIT_URL_KEY+id)||'null');
  return saved&&saved.exp>Date.now()&&validPortraitUrl(saved.url)?saved.url:null;
 }catch{return null}
}
function rememberPortraitUrl(id,url){
 if(!validPortraitUrl(url))return false;
 try{
  localStorage.setItem(PORTRAIT_URL_KEY+id,JSON.stringify({url,exp:Date.now()+7*86400000}));
  return true;
 }catch{return false}
}
function forgetPortraitUrl(id){
 try{localStorage.removeItem(PORTRAIT_URL_KEY+id)}catch{}
}

const characterArtCache=new Map(),characterArtJobs=new Map();
let characterVisibleLimit=16;
function characterArtQuery(c){return ANIME_ART_QUERY[c.id]||c.lookup||c.name}
function matchName(name,target){
 // Compare complete names/aliases, allowing name-order reversal. Do not
 // accept loose substring hits: those can show the wrong character.
 const clean=x=>String(x||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
 const wanted=clean(target);
 if(!wanted)return false;
 const tokens=wanted.split(' ').filter(Boolean).sort().join('|');
 return (Array.isArray(name)?name:[name]).some(candidate=>{
  const supplied=clean(candidate);
  return supplied===wanted||(wanted.includes(' ')&&supplied.split(' ').filter(Boolean).sort().join('|')===tokens);
 });
}
async function findAniListArt(query){
 const payload={query:'query ($search:String){Character(search:$search){name{full native alternative}image{large medium}}}',variables:{search:query}};
 const response=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
 if(!response.ok)throw Error('AniList response '+response.status);
 const data=await response.json(),character=data.data?.Character;
 if(!character||!matchName([character.name.full,character.name.native,...(character.name.alternative||[])],query))throw Error('AniList name mismatch');
 return character.image?.large||character.image?.medium||null;
}
async function findJikanArt(query){
 const response=await fetch('https://api.jikan.moe/v4/characters?q='+encodeURIComponent(query)+'&limit=8');
 if(!response.ok)throw Error('Jikan response '+response.status);
 const data=await response.json();
 const match=(data.data||[]).find(p=>matchName([p.name,p.name_kanji,...(p.nicknames||[])],query));
 return match?.images?.webp?.image_url||match?.images?.jpg?.image_url||null;
}
async function getCharacterArt(c,skipVerified=false,forceRefresh=false){
 if(!skipVerified&&VERIFIED_CHARACTER_IMAGE_URLS[c.id])return VERIFIED_CHARACTER_IMAGE_URLS[c.id];
 if(!forceRefresh){
  const old=characterArtCache.get(c.id);
  if(old&&old.exp>Date.now())return old.url;
  const saved=cachedPortraitUrl(c.id);
  if(saved){characterArtCache.set(c.id,{url:saved,exp:Date.now()+86400000});return saved}
 }
 if(characterArtJobs.has(c.id))return characterArtJobs.get(c.id);
 const job=(async()=>{
  const query=characterArtQuery(c);
  let url=null;
  try{url=await findAniListArt(query)}catch{}
  if(!url)try{url=await findJikanArt(query)}catch{}
  if(url&&validPortraitUrl(url)){
   characterArtCache.set(c.id,{url,exp:Date.now()+86400000*7});
   rememberPortraitUrl(c.id,url);
   return url;
  }
  if(forceRefresh)forgetPortraitUrl(c.id);
  characterArtCache.set(c.id,{url:null,exp:Date.now()+120000});
  return null;
 })().finally(()=>characterArtJobs.delete(c.id));
 characterArtJobs.set(c.id,job);
 return job;
}
// Portraits may be blocked by third-party image hosts. Never leave a visible
// character on an endless loading message. Preload, try another source,
// then show a distinctive styled fallback with a link to the profile.
function loadCharacterArt(root=document){
 const nodes=[...root.querySelectorAll('[data-character-art]')];
 const load=async el=>{
  const id=el.dataset.characterArt,c=CHARACTERS.find(x=>x.id===id);
  if(!c||el.dataset.loading==='1'||el.classList.contains('has-portrait'))return;
  el.dataset.loading='1';
  const note=el.querySelector('.character-loading small');
  const finish=()=>{
   if(!el.isConnected)return;
   el.dataset.loading='0';
   el.classList.add('art-unavailable');
   if(note)note.textContent='Illustrated preview · portrait unavailable';
  };
  const tryImage=url=>new Promise(resolve=>{
   if(!url||!el.isConnected){resolve(false);return}
   const img=new Image();
   let done=false;
   const timer=setTimeout(()=>complete(false),3800);
   function complete(success){
    if(done)return;
    done=true;clearTimeout(timer);
    img.onload=null;img.onerror=null;
    if(success&&el.isConnected){
     img.alt=c.name+' anime character portrait';img.loading='eager';img.decoding='async';img.referrerPolicy='no-referrer';
     el.querySelectorAll('img').forEach(old=>old.remove());
     el.prepend(img);el.classList.add('has-portrait');el.classList.remove('art-unavailable');
     if(validPortraitUrl(url))rememberPortraitUrl(c.id,url);
     if(url.startsWith('data:image/'))el.classList.add('has-custom-outfit');else el.classList.remove('has-custom-outfit');
     el.dataset.loading='0';
    }
    resolve(success);
   }
   img.onload=()=>complete(true);
   img.onerror=()=>complete(false);
   img.src=url;
  });
  const limit=(promise,ms)=>Promise.race([
   promise,new Promise(resolve=>setTimeout(()=>resolve(null),ms))
  ]);
  try{
   const outfitId=el.dataset.outfitArt;
   if(outfitId){const custom=await limit(savedOutfitImage(outfitId),1500);if(custom&&await tryImage(custom))return}
   const verified=VERIFIED_CHARACTER_IMAGE_URLS[c.id];
   if(verified&&await tryImage(verified))return;
   const saved=cachedPortraitUrl(c.id);
   if(saved&&saved!==verified){
    if(await tryImage(saved))return;
    forgetPortraitUrl(c.id);
   }
   const backup=await limit(getCharacterArt(c,true,true),4800);
   if(backup&&backup!==verified&&backup!==saved&&await tryImage(backup))return;
  }catch{}
  finish();
 };
 // The first visible portraits start immediately, even where IntersectionObserver
 // fails or a mobile webview never fires its initial intersection callback.
 let observer=null;
 if('IntersectionObserver' in window){
  observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){
    observer.unobserve(entry.target);void load(entry.target);
   }
  },{rootMargin:'400px'});
 }
 nodes.forEach((el,i)=>{
  if(observer)observer.observe(el);
  if(i<8)void load(el);
 });
}
function characterArtwork(c,o){
 const outfit=o?.name||'';
 const gradient='linear-gradient(140deg,'+(c.hair||'#172554')+','+(c.hair2||'#334155')+',#0b142c)';
 const preview=o&&o.id!==c.id+'-default';
 // An original character-colour sketch is the immediate offline fallback.
 // Public character portraits are loaded on top where their host permits it;
 // privately uploaded outfit pictures take priority over both.
 return '<div class="character-art outfit-style-'+esc(o?.styleId||'default')+'" data-character-art="'+esc(c.id)+'" data-outfit-art="'+esc(o?.id||'')+'" title="'+esc(c.name)+(outfit?' · '+esc(outfit):'')+'">'+
  '<div class="character-loading" style="background:'+gradient+'">'+avatarSVG(c,o)+'<small>Illustrated preview · finding portrait…</small></div>'+
  (o?illustratedCostume(c,o):'')+
  (preview?'<div class="outfit-overlay">'+esc(outfit)+'</div>':'')+
  '</div>';
}
const LOCATIONS=[
 {id:'london',name:'London',wiki:'London',lat:51.5072,lon:-0.1276,cost:0,region:'Europe'},
 {id:'tbilisi',name:'Tbilisi',wiki:'Tbilisi',lat:41.7151,lon:44.8271,cost:25,region:'Asia'},
 {id:'tokyo',name:'Tokyo',wiki:'Tokyo',lat:35.6762,lon:139.6503,cost:30,region:'Asia'},
 {id:'seoul',name:'Seoul',wiki:'Seoul',lat:37.5665,lon:126.9780,cost:35,region:'Asia'},
 {id:'busan',name:'Busan',wiki:'Busan',lat:35.1796,lon:129.0756,cost:40,region:'Asia'},
 {id:'hongkong',name:'Hong Kong',wiki:'Hong_Kong',lat:22.3193,lon:114.1694,cost:45,region:'Asia'},
 {id:'singapore',name:'Singapore',wiki:'Singapore',lat:1.3521,lon:103.8198,cost:50,region:'Asia'},
 {id:'shanghai',name:'Shanghai',wiki:'Shanghai',lat:31.2304,lon:121.4737,cost:55,region:'Asia'},
 {id:'shenzhen',name:'Shenzhen',wiki:'Shenzhen',lat:22.5431,lon:114.0579,cost:60,region:'Asia'},
 {id:'beijing',name:'Beijing',wiki:'Beijing',lat:39.9042,lon:116.4074,cost:65,region:'Asia'},
 {id:'manila',name:'Manila',wiki:'Manila',lat:14.5995,lon:120.9842,cost:70,region:'Asia'},
 {id:'bohol',name:'Bohol',wiki:'Bohol',lat:9.8500,lon:124.1435,cost:75,region:'Asia'},
 {id:'coron',name:'Coron',wiki:'Coron,_Palawan',lat:12.0,lon:120.2,cost:80,region:'Asia'},
 {id:'bali',name:'Bali',wiki:'Bali',lat:-8.3405,lon:115.0920,cost:85,region:'Asia'},
 {id:'hanoi',name:'Hanoi',wiki:'Hanoi',lat:21.0278,lon:105.8342,cost:90,region:'Asia'},
 {id:'hochiminh',name:'Ho Chi Minh City',wiki:'Ho_Chi_Minh_City',lat:10.8231,lon:106.6297,cost:95,region:'Asia'},
 {id:'bangkok',name:'Bangkok',wiki:'Bangkok',lat:13.7563,lon:100.5018,cost:100,region:'Asia'},
 {id:'kualalumpur',name:'Kuala Lumpur',wiki:'Kuala_Lumpur',lat:3.1390,lon:101.6869,cost:105,region:'Asia'},
 {id:'almaty',name:'Almaty',wiki:'Almaty',lat:43.2389,lon:76.8897,cost:110,region:'Asia'},
 {id:'bishkek',name:'Bishkek',wiki:'Bishkek',lat:42.8746,lon:74.5698,cost:115,region:'Asia'},
 {id:'samarkand',name:'Samarkand',wiki:'Samarkand',lat:39.6542,lon:66.9597,cost:120,region:'Asia'},
 {id:'petra',name:'Petra',wiki:'Petra',lat:30.3285,lon:35.4444,cost:125,region:'Asia'},
 {id:'nairobi',name:'Nairobi',wiki:'Nairobi',lat:-1.2921,lon:36.8219,cost:130,region:'Africa'},
 {id:'capetown',name:'Cape Town',wiki:'Cape_Town',lat:-33.9249,lon:18.4241,cost:135,region:'Africa'},
 {id:'cusco',name:'Cusco',wiki:'Cusco',lat:-13.5319,lon:-71.9675,cost:140,region:'South America'},
 {id:'machupicchu',name:'Machu Picchu',wiki:'Machu_Picchu',lat:-13.1631,lon:-72.5450,cost:150,region:'South America'},
 {id:'rio',name:'Rio de Janeiro',wiki:'Rio_de_Janeiro',lat:-22.9068,lon:-43.1729,cost:155,region:'South America'},
 {id:'newyork',name:'New York City',wiki:'New_York_City',lat:40.7128,lon:-74.0060,cost:160,region:'North America'},
 {id:'vancouver',name:'Vancouver',wiki:'Vancouver',lat:49.2827,lon:-123.1207,cost:165,region:'North America'},
 {id:'reykjavik',name:'Reykjavík',wiki:'Reykjavík',lat:64.1466,lon:-21.9426,cost:170,region:'Europe'},
 {id:'sydney',name:'Sydney',wiki:'Sydney',lat:-33.8688,lon:151.2093,cost:175,region:'Oceania'},
 {id:'kyoto',name:'Kyoto',wiki:'Kyoto',lat:35.0116,lon:135.7681,cost:180,region:'Asia'},
 {id:'gyeongju',name:'Gyeongju',wiki:'Gyeongju',lat:35.8562,lon:129.2247,cost:185,region:'Asia'},
 {id:'taipei',name:'Taipei',wiki:'Taipei',lat:25.0330,lon:121.5654,cost:190,region:'Asia'},
 {id:'angkor',name:'Angkor Wat',wiki:'Angkor_Wat',lat:13.4125,lon:103.8670,cost:195,region:'Asia'},
 {id:'dubai',name:'Dubai',wiki:'Dubai',lat:25.2048,lon:55.2708,cost:200,region:'Asia'},
 {id:'istanbul',name:'Istanbul',wiki:'Istanbul',lat:41.0082,lon:28.9784,cost:205,region:'Europe'},
 {id:'venice',name:'Venice',wiki:'Venice',lat:45.4408,lon:12.3155,cost:210,region:'Europe'},
 {id:'paris',name:'Paris',wiki:'Paris',lat:48.8566,lon:2.3522,cost:215,region:'Europe'},
 {id:'edinburgh',name:'Edinburgh',wiki:'Edinburgh',lat:55.9533,lon:-3.1883,cost:220,region:'Europe'},
 {id:'dublin',name:'Dublin',wiki:'Dublin',lat:53.3498,lon:-6.2603,cost:225,region:'Europe'},
 {id:'rome',name:'Rome',wiki:'Rome',lat:41.9028,lon:12.4964,cost:230,region:'Europe'},
 {id:'barcelona',name:'Barcelona',wiki:'Barcelona',lat:41.3874,lon:2.1686,cost:235,region:'Europe'},
 {id:'lisbon',name:'Lisbon',wiki:'Lisbon',lat:38.7223,lon:-9.1393,cost:240,region:'Europe'},
 {id:'amsterdam',name:'Amsterdam',wiki:'Amsterdam',lat:52.3676,lon:4.9041,cost:245,region:'Europe'},
 {id:'prague',name:'Prague',wiki:'Prague',lat:50.0755,lon:14.4378,cost:250,region:'Europe'},
 {id:'vienna',name:'Vienna',wiki:'Vienna',lat:48.2082,lon:16.3738,cost:255,region:'Europe'},
 {id:'athens',name:'Athens',wiki:'Athens',lat:37.9838,lon:23.7275,cost:260,region:'Europe'},
 {id:'zurich',name:'Zürich',wiki:'Zürich',lat:47.3769,lon:8.5417,cost:265,region:'Europe'},
 {id:'stockholm',name:'Stockholm',wiki:'Stockholm',lat:59.3293,lon:18.0686,cost:270,region:'Europe'},
 {id:'dubrovnik',name:'Dubrovnik',wiki:'Dubrovnik',lat:42.6507,lon:18.0944,cost:275,region:'Europe'},
 {id:'budapest',name:'Budapest',wiki:'Budapest',lat:47.4979,lon:19.0402,cost:280,region:'Europe'},
 {id:'marrakech',name:'Marrakesh',wiki:'Marrakesh',lat:31.6295,lon:-7.9811,cost:285,region:'Africa'},
 {id:'fes',name:'Fez',wiki:'Fez,_Morocco',lat:34.0646,lon:-5,cost:290,region:'Africa'},
 {id:'cairo',name:'Cairo',wiki:'Cairo',lat:30.0444,lon:31.2357,cost:295,region:'Africa'},
 {id:'luxor',name:'Luxor',wiki:'Luxor',lat:25.6872,lon:32.6396,cost:300,region:'Africa'},
 {id:'alexandria',name:'Alexandria',wiki:'Alexandria',lat:31.2001,lon:29.9187,cost:305,region:'Africa'},
 {id:'tunis',name:'Tunis',wiki:'Tunis',lat:36.8065,lon:10.1815,cost:310,region:'Africa'},
 {id:'dakar',name:'Dakar',wiki:'Dakar',lat:14.6928,lon:-17.4467,cost:315,region:'Africa'},
 {id:'accra',name:'Accra',wiki:'Accra',lat:5.6037,lon:-0.187,cost:320,region:'Africa'},
 {id:'lagos',name:'Lagos',wiki:'Lagos',lat:6.5244,lon:3.3792,cost:325,region:'Africa'},
 {id:'addis',name:'Addis Ababa',wiki:'Addis_Ababa',lat:9.03,lon:38.74,cost:330,region:'Africa'},
 {id:'zanzibar',name:'Stone Town, Zanzibar',wiki:'Stone_Town',lat:-6.1639,lon:39.1931,cost:335,region:'Africa'},
 {id:'victoriafalls',name:'Victoria Falls',wiki:'Victoria_Falls',lat:-17.9243,lon:25.8572,cost:340,region:'Africa'},
 {id:'sossusvlei',name:'Sossusvlei',wiki:'Sossusvlei',lat:-24.7269,lon:15.2935,cost:345,region:'Africa'},
 {id:'mahe',name:'Mahé',wiki:'Mahé,_Seychelles',lat:-4.6796,lon:55.492,cost:350,region:'Africa'},
 {id:'antananarivo',name:'Antananarivo',wiki:'Antananarivo',lat:-18.8792,lon:47.5079,cost:355,region:'Africa'},
 {id:'portlouis',name:'Port Louis',wiki:'Port_Louis',lat:-20.1609,lon:57.5012,cost:360,region:'Africa'},
 {id:'toronto',name:'Toronto',wiki:'Toronto',lat:43.6532,lon:-79.3832,cost:365,region:'North America'},
 {id:'montreal',name:'Montréal',wiki:'Montreal',lat:45.5017,lon:-73.5673,cost:370,region:'North America'},
 {id:'quebec',name:'Québec City',wiki:'Quebec_City',lat:46.8139,lon:-71.208,cost:375,region:'North America'},
 {id:'chicago',name:'Chicago',wiki:'Chicago',lat:41.8781,lon:-87.6298,cost:380,region:'North America'},
 {id:'washingtondc',name:'Washington, DC',wiki:'Washington,_D.C.',lat:38.9072,lon:-77.0369,cost:385,region:'North America'},
 {id:'sanfrancisco',name:'San Francisco',wiki:'San_Francisco',lat:37.7749,lon:-122.4194,cost:390,region:'North America'},
 {id:'losangeles',name:'Los Angeles',wiki:'Los_Angeles',lat:34.0522,lon:-118.2437,cost:395,region:'North America'},
 {id:'mexicocity',name:'Mexico City',wiki:'Mexico_City',lat:19.4326,lon:-99.1332,cost:400,region:'North America'},
 {id:'oaxaca',name:'Oaxaca',wiki:'Oaxaca_City',lat:17.0732,lon:-96.7266,cost:405,region:'North America'},
 {id:'chichenitza',name:'Chichén Itzá',wiki:'Chichen_Itza',lat:20.6843,lon:-88.5678,cost:410,region:'North America'},
 {id:'havana',name:'Havana',wiki:'Havana',lat:23.1136,lon:-82.3666,cost:415,region:'North America'},
 {id:'antiguaguatemala',name:'Antigua Guatemala',wiki:'Antigua_Guatemala',lat:14.5586,lon:-90.7333,cost:420,region:'North America'},
 {id:'sanjosecr',name:'San José, Costa Rica',wiki:'San_José,_Costa_Rica',lat:9.9281,lon:-84.0907,cost:425,region:'North America'},
 {id:'panamacity',name:'Panama City',wiki:'Panama_City',lat:8.9824,lon:-79.5199,cost:430,region:'North America'},
 {id:'banff',name:'Banff National Park',wiki:'Banff_National_Park',lat:51.4968,lon:-115.9281,cost:435,region:'North America'},
 {id:'yellowstone',name:'Yellowstone National Park',wiki:'Yellowstone_National_Park',lat:44.428,lon:-110.5885,cost:440,region:'North America'},
 {id:'buenosaires',name:'Buenos Aires',wiki:'Buenos_Aires',lat:-34.6037,lon:-58.3816,cost:445,region:'South America'},
 {id:'iguazu',name:'Iguazú Falls',wiki:'Iguazu_Falls',lat:-25.6953,lon:-54.4367,cost:450,region:'South America'},
 {id:'santiago',name:'Santiago',wiki:'Santiago',lat:-33.4489,lon:-70.6693,cost:455,region:'South America'},
 {id:'atacama',name:'San Pedro de Atacama',wiki:'San_Pedro_de_Atacama',lat:-22.9087,lon:-68.1997,cost:460,region:'South America'},
 {id:'torres',name:'Torres del Paine',wiki:'Torres_del_Paine_National_Park',lat:-50.9423,lon:-73.4068,cost:465,region:'South America'},
 {id:'lapaz',name:'La Paz',wiki:'La_Paz',lat:-16.4897,lon:-68.1193,cost:470,region:'South America'},
 {id:'uyuni',name:'Salar de Uyuni',wiki:'Salar_de_Uyuni',lat:-20.1338,lon:-67.4891,cost:475,region:'South America'},
 {id:'lima',name:'Lima',wiki:'Lima',lat:-12.0464,lon:-77.0428,cost:480,region:'South America'},
 {id:'bogota',name:'Bogotá',wiki:'Bogotá',lat:4.711,lon:-74.0721,cost:485,region:'South America'},
 {id:'cartagena',name:'Cartagena',wiki:'Cartagena,_Colombia',lat:10.391,lon:-75.4794,cost:490,region:'South America'},
 {id:'medellin',name:'Medellín',wiki:'Medellín',lat:6.2442,lon:-75.5812,cost:495,region:'South America'},
 {id:'quito',name:'Quito',wiki:'Quito',lat:-0.1807,lon:-78.4678,cost:500,region:'South America'},
 {id:'galapagos',name:'Galápagos Islands',wiki:'Galápagos_Islands',lat:-0.9538,lon:-90.9656,cost:505,region:'South America'},
 {id:'manaus',name:'Manaus',wiki:'Manaus',lat:-3.119,lon:-60.0217,cost:510,region:'South America'},
 {id:'montevideo',name:'Montevideo',wiki:'Montevideo',lat:-34.9011,lon:-56.1645,cost:515,region:'South America'},
 {id:'melbourne',name:'Melbourne',wiki:'Melbourne',lat:-37.8136,lon:144.9631,cost:520,region:'Oceania'},
 {id:'canberra',name:'Canberra',wiki:'Canberra',lat:-35.2809,lon:149.13,cost:525,region:'Oceania'},
 {id:'brisbane',name:'Brisbane',wiki:'Brisbane',lat:-27.4698,lon:153.0251,cost:530,region:'Oceania'},
 {id:'perth',name:'Perth',wiki:'Perth',lat:-31.9505,lon:115.8605,cost:535,region:'Oceania'},
 {id:'cairns',name:'Cairns',wiki:'Cairns',lat:-16.9186,lon:145.7781,cost:540,region:'Oceania'},
 {id:'adelaide',name:'Adelaide',wiki:'Adelaide',lat:-34.9285,lon:138.6007,cost:545,region:'Oceania'},
 {id:'hobart',name:'Hobart',wiki:'Hobart',lat:-42.8821,lon:147.3272,cost:550,region:'Oceania'},
 {id:'uluru',name:'Uluru',wiki:'Uluru',lat:-25.3444,lon:131.0369,cost:555,region:'Oceania'},
 {id:'greatbarrier',name:'Great Barrier Reef',wiki:'Great_Barrier_Reef',lat:-18.2871,lon:147.6992,cost:560,region:'Oceania'},
 {id:'whitsundays',name:'Whitsunday Islands',wiki:'Whitsunday_Islands',lat:-20.269,lon:148.9462,cost:565,region:'Oceania'},
 {id:'auckland',name:'Auckland',wiki:'Auckland',lat:-36.8485,lon:174.7633,cost:570,region:'Oceania'},
 {id:'wellington',name:'Wellington',wiki:'Wellington',lat:-41.2865,lon:174.7762,cost:575,region:'Oceania'},
 {id:'queenstown',name:'Queenstown',wiki:'Queenstown,_New_Zealand',lat:-45.0312,lon:168.6626,cost:580,region:'Oceania'},
 {id:'rotorua',name:'Rotorua',wiki:'Rotorua',lat:-38.1368,lon:176.2497,cost:585,region:'Oceania'},
 {id:'milfordsound',name:'Milford Sound',wiki:'Milford_Sound',lat:-44.6414,lon:167.8973,cost:590,region:'Oceania'},
 {id:'nadi',name:'Nadi',wiki:'Nadi',lat:-17.7765,lon:177.4356,cost:595,region:'Oceania'},
 {id:'borabora',name:'Bora Bora',wiki:'Bora_Bora',lat:-16.5004,lon:-151.7415,cost:600,region:'Oceania'},
 {id:'copenhagen',name:'Copenhagen',wiki:'Copenhagen',lat:55.6761,lon:12.5683,cost:605,region:'Europe'},
 {id:'bergen',name:'Bergen',wiki:'Bergen',lat:60.3913,lon:5.3221,cost:610,region:'Europe'},
 {id:'ljubljana',name:'Ljubljana',wiki:'Ljubljana',lat:46.0569,lon:14.5058,cost:615,region:'Europe'},
 {id:'chefchaouen',name:'Chefchaouen',wiki:'Chefchaouen',lat:35.1688,lon:-5.2697,cost:620,region:'Africa'},
 {id:'okavango',name:'Okavango Delta',wiki:'Okavango_Delta',lat:-19.3,lon:22.9,cost:625,region:'Africa'},
 {id:'kigali',name:'Kigali',wiki:'Kigali',lat:-1.9441,lon:30.0619,cost:630,region:'Africa'},
 {id:'grandcanyon',name:'Grand Canyon',wiki:'Grand_Canyon',lat:36.0566,lon:-112.1251,cost:635,region:'North America'},
 {id:'montegobay',name:'Montego Bay',wiki:'Montego_Bay',lat:18.4762,lon:-77.8939,cost:640,region:'North America'},
 {id:'anchorage',name:'Anchorage',wiki:'Anchorage,_Alaska',lat:61.2181,lon:-149.9003,cost:645,region:'North America'},
 {id:'peritomoreno',name:'Perito Moreno Glacier',wiki:'Perito_Moreno_Glacier',lat:-50.4967,lon:-73.1379,cost:650,region:'South America'},
 {id:'easterisland',name:'Rapa Nui',wiki:'Easter_Island',lat:-27.1479,lon:-109.427,cost:655,region:'South America'},
 {id:'valparaiso',name:'Valparaíso',wiki:'Valparaíso',lat:-33.0472,lon:-71.6127,cost:660,region:'South America'},
 {id:'apia',name:'Apia',wiki:'Apia',lat:-13.8333,lon:-171.7667,cost:665,region:'Oceania'},
 {id:'portvila',name:'Port Vila',wiki:'Port_Vila',lat:-17.7333,lon:168.3273,cost:670,region:'Oceania'},
 {id:'papeete',name:'Papeete',wiki:'Papeete',lat:-17.5516,lon:-149.5585,cost:675,region:'Oceania'},
 {id:'porto',name:'Porto',wiki:'Porto',lat:41.1579,lon:-8.6291,cost:680,region:'Europe'},
 {id:'granada',name:'Granada',wiki:'Granada',lat:37.1773,lon:-3.5986,cost:685,region:'Europe'},
 {id:'seville',name:'Seville',wiki:'Seville',lat:37.3891,lon:-5.9845,cost:690,region:'Europe'},
 {id:'valencia',name:'Valencia',wiki:'Valencia',lat:39.4699,lon:-0.3763,cost:695,region:'Europe'},
 {id:'florence',name:'Florence',wiki:'Florence',lat:43.7696,lon:11.2558,cost:700,region:'Europe'},
 {id:'krakow',name:'Kraków',wiki:'Kraków',lat:50.0647,lon:19.945,cost:705,region:'Europe'},
 {id:'tallinn',name:'Tallinn',wiki:'Tallinn',lat:59.437,lon:24.7536,cost:710,region:'Europe'},
 {id:'riga',name:'Riga',wiki:'Riga',lat:56.9496,lon:24.1052,cost:715,region:'Europe'},
 {id:'vilnius',name:'Vilnius',wiki:'Vilnius',lat:54.6872,lon:25.2797,cost:720,region:'Europe'},
 {id:'salzburg',name:'Salzburg',wiki:'Salzburg',lat:47.8095,lon:13.055,cost:725,region:'Europe'},
 {id:'sarajevo',name:'Sarajevo',wiki:'Sarajevo',lat:43.8563,lon:18.4131,cost:730,region:'Europe'},
 {id:'mostar',name:'Mostar',wiki:'Mostar',lat:43.3438,lon:17.8078,cost:735,region:'Europe'},
 {id:'kotor',name:'Kotor',wiki:'Kotor',lat:42.4247,lon:18.7712,cost:740,region:'Europe'},
 {id:'casablanca',name:'Casablanca',wiki:'Casablanca',lat:33.5731,lon:-7.5898,cost:745,region:'Africa'},
 {id:'essaouira',name:'Essaouira',wiki:'Essaouira',lat:31.5085,lon:-9.7595,cost:750,region:'Africa'},
 {id:'aswan',name:'Aswan',wiki:'Aswan',lat:24.0889,lon:32.8998,cost:755,region:'Africa'},
 {id:'sidi_bou_said',name:'Sidi Bou Said',wiki:'Sidi_Bou_Said',lat:36.8702,lon:10.3411,cost:760,region:'Africa'},
 {id:'cape_coast',name:'Cape Coast',wiki:'Cape_Coast',lat:5.1053,lon:-1.2466,cost:765,region:'Africa'},
 {id:'cape_town',name:'Cape Town',wiki:'Cape_Town',lat:-33.9249,lon:18.4241,cost:770,region:'Africa'},
 {id:'stellenbosch',name:'Stellenbosch',wiki:'Stellenbosch',lat:-33.9321,lon:18.8602,cost:775,region:'Africa'},
 {id:'windhoek',name:'Windhoek',wiki:'Windhoek',lat:-22.5609,lon:17.0658,cost:780,region:'Africa'},
 {id:'swakopmund',name:'Swakopmund',wiki:'Swakopmund',lat:-22.6784,lon:14.5258,cost:785,region:'Africa'},
 {id:'stone_town',name:'Stone Town',wiki:'Stone_Town',lat:-6.1622,lon:39.1921,cost:790,region:'Africa'},
 {id:'arusha',name:'Arusha',wiki:'Arusha',lat:-3.3869,lon:36.683,cost:795,region:'Africa'},
 {id:'kampala',name:'Kampala',wiki:'Kampala',lat:0.3476,lon:32.5825,cost:800,region:'Africa'},
 {id:'mombasa',name:'Mombasa',wiki:'Mombasa',lat:-4.0435,lon:39.6682,cost:805,region:'Africa'},
 {id:'victoria_falls',name:'Victoria Falls',wiki:'Victoria_Falls',lat:-17.9243,lon:25.856,cost:810,region:'Africa'},
 {id:'nosy_be',name:'Nosy Be',wiki:'Nosy_Be',lat:-13.3126,lon:48.2584,cost:815,region:'Africa'},
 {id:'addis_ababa',name:'Addis Ababa',wiki:'Addis_Ababa',lat:9.03,lon:38.74,cost:820,region:'Africa'},
 {id:'mount_cook',name:'Aoraki / Mount Cook',wiki:'Aoraki_/_Mount_Cook',lat:-43.595,lon:170.141,cost:825,region:'Oceania'}
];


// Location costs reflect broad destination prominence rather than insertion order.
// London is the free starting location. Other historical destinations
// are 50 (regular), 75 (major), or 100 (iconic) points for new purchases.
const ICONIC_LOCATION_IDS=new Set([
 'tokyo','london','paris','newyork','rome','sydney','singapore','hongkong','bali',
 'kyoto','machupicchu','petra','venice','cairo','rio','capetown','grandcanyon',
 'pyramids','angkor','istanbul','dubai','beijing','reykjavik','santorini'
]);
const MAJOR_LOCATION_IDS=new Set([
 'seoul','shanghai','bangkok','barcelona','amsterdam','lisbon','vienna','athens',
 'edinburgh','marrakesh','sanfrancisco','losangeles','vancouver','hanoi',
 'berlin','prague','florence','almaty','nairobi','cusco','buenosaires','seville'
]);
LOCATIONS.forEach(l=>{
 if(l.id==='london'){l.cost=0;return}
 l.cost=ICONIC_LOCATION_IDS.has(l.id)?100:
  MAJOR_LOCATION_IDS.has(l.id)?75:50;
});
// Additional country/ocean/sea pins have NEW IDs. Do not change the old
// locations, historical cost tiers, or any saved purchase identifier.
if(typeof window!=='undefined'&&Array.isArray(window.RevisionWorldDestinations)){
 const existing=new Set(LOCATIONS.map(x=>x.id));
 for(const destination of window.RevisionWorldDestinations){
  if(!existing.has(destination.id)){LOCATIONS.push({...destination});existing.add(destination.id)}
 }
}

// Use actual WGS84 Natural Earth geography, pre-cached with the app.
 // Blue Marble remote-image failures previously left a blue circle with no continents.
const EARTH_TEXTURE_URL='https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Marble_2002.jpg?width=2048';
let earthTextureReady=false,earthPixels=null,earthW=0,earthH=0;
let satelliteReady=false;
if(window.RevisionWorldEarth){
 window.RevisionWorldEarth.load().then(texture=>{
  if(!satelliteReady){
   earthPixels=texture.pixels;earthW=texture.width;earthH=texture.height;
   earthTextureReady=true;drawGlobe();
  }
 }).catch(error=>{console.warn('Local Natural Earth map unavailable',error);drawGlobe()});
}
// NASA's public-domain 2002 Blue Marble is a true-colour Earth mosaic.
// Use its modest-size equirectangular preview when the browser accepts CORS;
// Natural Earth geography remains a fully offline, geometrically correct fallback.
const nasaEarth=new Image();
nasaEarth.crossOrigin='anonymous';
nasaEarth.onload=()=>{
 try{
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
  const c=canvas.getContext('2d',{willReadFrequently:true});
  c.drawImage(nasaEarth,0,0,2048,1024);
  const pixels=c.getImageData(0,0,1024,512);
  if(pixels?.data?.length===2048*1024*4){
   earthPixels=pixels.data;earthW=2048;earthH=1024;earthTextureReady=true;
   satelliteReady=true;drawGlobe();
  }
 }catch(error){console.warn('Using offline Natural Earth globe instead of remote satellite imagery',error)}
};
nasaEarth.onerror=()=>{};
nasaEarth.src=EARTH_TEXTURE_URL;
// Wikipedia lead photos are resolved with verified Commons rights metadata.

function load(k,f){try{const x=JSON.parse(localStorage.getItem(k));return x??f}catch{return f}}
function save(){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));if(window.RevisionLoopCloudSync)window.RevisionLoopCloudSync.onLocalSaved()}
function ensureProfile(){
 profile.daily=profile.daily||{};profile.examResults=profile.examResults||{};profile.topicWeakness=profile.topicWeakness||{};profile.topicStats=profile.topicStats||{};
 profile.errorLog=profile.errorLog||[];profile.dailyChallenges=profile.dailyChallenges||{};profile.challengeStreak=profile.challengeStreak||0;profile.lastChallengeDate=profile.lastChallengeDate||'';
 // Back up the exact last saved profile before the first economy migration.
 // Never reset previously earned XP/points or discard unfamiliar historical purchases.
 if(profile.economyVersion!==2){
  try{
   const backupKey='revisionLoopProfile-pre-world-v62';
   if(!localStorage.getItem(backupKey)){
    const original=localStorage.getItem(PROFILE_KEY);
    if(original)localStorage.setItem(backupKey,original);
   }
  }catch{}
 }
 const safety=window.RevisionWorldProfileSafety;
 if(safety){
  profile=safety.migrateProfile(profile);
 }else{
  // Safe offline fallback if the additional script is not cached yet:
  // preserve the whole object, all historic IDs, and earned balances.
  profile.shopOwned=profile.shopOwned||{};
  for(const kind of ['characters','outfits','locations']){
   profile.shopOwned[kind]=Array.isArray(profile.shopOwned[kind])?profile.shopOwned[kind]:[];
  }
  if(!profile.shopOwned.characters.includes('lelouch'))profile.shopOwned.characters.unshift('lelouch');
  if(!profile.shopOwned.outfits.includes('lelouch-default'))profile.shopOwned.outfits.unshift('lelouch-default');
  if(!profile.shopOwned.locations.includes('london'))profile.shopOwned.locations.unshift('london');
  profile.points=Number.isFinite(profile.points)?Math.max(0,profile.points):0;
  profile.lifetimeXp=Number.isFinite(profile.lifetimeXp)?Math.max(0,profile.lifetimeXp):0;
  profile.reviews=Number.isFinite(profile.reviews)?Math.max(0,profile.reviews):0;
  profile.equippedCharacter=profile.equippedCharacter||'lelouch';
  profile.equippedOutfit=profile.equippedOutfit||'lelouch-default';
  profile.equippedLocation=profile.equippedLocation||'london';
  profile.economyVersion=2;
 }
 settings.dailyNew=settings.dailyNew||18;settings.physicsUnits=settings.physicsUnits||{};
}
function now(){return Date.now()}
function dateKey(t=Date.now()){
 const d=new Date(t);
 return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
}
// Bonus is one point for each consecutive previous day: day 1 = 0, day 5 = 4.
function challengeBonusForStreak(streak){return Math.max(0,Math.floor(streak)-1)}
function previousCalendarDate(){
 const d=new Date();d.setDate(d.getDate()-1);return dateKey(d);
}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))} function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function daily(){const k=dateKey();if(!profile.daily[k])profile.daily[k]={reviews:0,newCards:0,flashCorrect:0,examMarks:0};return profile.daily[k]}
function state(id){const x=progress[id]||{};return {stage:-1,due:0,mastered:false,again:0,hard:0,good:0,last:0,firstSeen:'',stability:0,difficulty:5,history:[],...x}}
function setState(id,s){progress[id]=s}
function showToast(m){const e=document.getElementById('toast');e.textContent=m;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),1700)}
function award(points,reason=''){points=Math.max(0,Math.floor(points));if(!points)return;profile.lifetimeXp+=points;profile.points+=points;daily().examMarks+=reason==='exam'?points:0;save();showToast('+'+points+' point'+(points===1?'':'s')+' · +'+points+' XP')}
function levelInfo(xp){
 let level=1,into=xp;
 while(level<500){const req=10+5*(level-1);if(into<req)return {level,into,req};into-=req;level++}
 return {level:500,into:0,req:0};
}
function memoryHealth(c){const s=state(c.id);if(s.stage<0)return 0;if(!s.last)return .5;const stability=Math.max(.25,s.stability||3),elapsed=Math.max(0,(now()-s.last)/DAY);return clamp(Math.exp(-0.1053605*elapsed/stability),0,1)}
function topicKey(s,t){return s+'|'+t}
function topicStat(s,t){const k=topicKey(s,t);if(!profile.topicStats[k])profile.topicStats[k]={attempts:0,success:0,examMarks:0,examMax:0,last:0,lastMiss:0};return profile.topicStats[k]}
function weakness(c){const s=state(c.id),specific=profile.topicWeakness[topicKey(c.subject,c.revisionTopic||c.topic)]||0,legacy=profile.topicWeakness[topicKey(c.subject,c.courseTopic||c.topic)]||0;return (c.priority||1)*3+(s.again||0)*2.6+(s.hard||0)*1.6+specific*2+legacy*.4+(1-memoryHealth(c))*8-(s.good||0)*.2}
function isDue(c){const s=state(c.id);return s.stage>=0&&(s.due||0)<=now()} function isNew(c){return state(c.id).stage<0}
function addError(e){profile.errorLog.unshift({...e,date:now()});if(profile.errorLog.length>400)profile.errorLog.length=400}

async function sha256(s){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function unlock(pin,remember){
 const h=await sha256('revision-loop|'+pin);if(h!==PIN_HASH)return false;
 if(remember)localStorage.setItem('rl_auth','1');else sessionStorage.setItem('rl_auth','1');
 document.getElementById('authGate').classList.add('hidden');document.getElementById('app').classList.remove('app-locked');return true;
}
function lockApp(){localStorage.removeItem('rl_auth');sessionStorage.removeItem('rl_auth');document.getElementById('authGate').classList.remove('hidden');document.getElementById('app').classList.add('app-locked');document.getElementById('pinInput').value='';document.getElementById('pinInput').focus()}

function initPhysicsUnits(){(deckMeta.physicsUnits||[]).forEach(u=>{if(settings.physicsUnits[u.id]===undefined)settings.physicsUnits[u.id]=!!u.defaultUnlocked})}
function physicsUnlocked(c){if(c.subject!=='Physics'||!c.unit)return true;const u=(deckMeta.physicsUnits||[]).find(x=>x.id===c.unit);return settings.physicsUnits[c.unit]!==undefined?settings.physicsUnits[c.unit]!==false:(u?!!u.defaultUnlocked:true)}
function taughtCard(c){return c.taught===true}
function subjectCards(sub){return cards.filter(c=>c.active!==false&&c.subject===sub)}
function subjectExam(sub){
 const level=document.getElementById('examLevel')?.value||'both';
 return examQuestions.filter(q=>q.subject===sub&&q.standalone!==false&&(level==='both'||q.level===level));
}

function normalise(x){
 let s=String(x||'').normalize('NFKD').toLowerCase();
 // Preserve apostrophe-containing words as words: can't -> cant, not can + t.
 // Otherwise an unrelated contraction can trigger a one-letter unit/prefix symbol.
 s=s.replace(/([a-z])['’]([a-z])/g,'$1$2');
 const r=[
  [/θ/g,' theta '],[/λ/g,' lambda '],[/ρ/g,' rho '],[/δ|Δ/g,' delta '],[/φ/g,' phi '],[/ε/g,' epsilon '],
  [/√/g,' sqrt '],[/²/g,'^2'],[/³/g,'^3'],[/−|–|—/g,'-'],[/×|·/g,' * '],[/÷/g,' / '],
  [/\bcosine\b/g,'cos'],[/\bsine\b/g,'sin'],[/\btangent\b/g,'tan'],[/\bperp\b/g,'perpendicular'],
  [/\bdegrees?\b/g,' degree '],[/\bnewtons?\b/g,' n '],[/\bjoules?\b/g,' j '],[/\bvolts?\b/g,' v ']
 ];
 r.forEach(a=>s=s.replace(a[0],a[1]));
 s=s.replace(/([a-z0-9])(cos|sin|tan)(?=\s*theta\b)/g,'$1 $2');
 return s.replace(/[^a-z0-9+\-*/=<>^.[\] ]+/g,' ').replace(/\s+/g,' ').trim();
}
const STOP=new Set(['the','a','an','of','to','and','in','is','are','with','at','on','for','from','by','it','be','as','or','that','this','using','use','one','each','then','so','a','an']);
const SYN=[
 ['resultant','net'],
 ['equal','same','identical'],
 ['opposite','reverse'],
 ['increase','increases','greater','larger','higher','rise','rises'],
 ['decrease','decreases','smaller','lower','fall','falls','reduce','reduced'],
 ['velocity','velocities'],
 ['acceleration','accelerate','accelerates','accelerating'],
 ['force','forces'],
 ['collision','collisions','collide','collides'],
 ['momentum','momenta'],
 ['resistance','resistor'],
 ['current','charge flow'],
 ['potential difference','pd','voltage'],
 ['electromotive force','emf'],
 ['amount','moles','mole'],
 ['concentration','molarity'],
 ['perpendicular','normal'],
 ['parallel','same direction'],
 ['different objects','different bodies','separate objects'],
 ['same type','same interaction'],
 ['mass times acceleration','ma','m*a'],
 ['rate of change','change per second'],
 ['random','unpredictable'],
 ['systematic','consistent'],
 ['uncertainty','error range'],
 ['gradient','slope'],
 ['intercept','axis intercept']
];
const OPPOSITES=[
 ['increase','decrease'],['higher','lower'],['greater','smaller'],['positive','negative'],
 ['attract','repel'],['attractive','repulsive'],['parallel','perpendicular'],
 ['clockwise','anticlockwise'],['gain','lose'],['gains','loses'],['absorbed','emitted'],
 ['constructive','destructive'],['maximum','minimum']
];
function hasMeaning(text,word){
 const nt=' '+normalise(text)+' ',tokens=normalise(text).split(' ');
 const alternatives=synonymSet(word);
 return alternatives.some(alt=>nt.includes(' '+alt+' ')||tokens.includes(alt));
}
function contradicts(answer,point){
 for(const [a,b] of OPPOSITES){
   const pa=hasMeaning(point,a),pb=hasMeaning(point,b),aa=hasMeaning(answer,a),ab=hasMeaning(answer,b);
   if(pa&&pb)continue; // A model response contrasting two opposites is not contradicted by naming either one alone.
   if(aa&&ab)continue;
   if((pa&&ab&&!aa)||(pb&&aa&&!ab))return true;
 }
 return false;
}
function stemToken(t){
 if(t.length>6&&t.endsWith('ing'))return t.slice(0,-3);
 if(t.length>5&&t.endsWith('ied'))return t.slice(0,-3)+'y';
 if(t.length>5&&t.endsWith('ed'))return t.slice(0,-2);
 if(t.length>5&&t.endsWith('es'))return t.slice(0,-2);
 if(t.length>4&&t.endsWith('s'))return t.slice(0,-1);
 return t;
}
function synonymSet(t){
 const n=normalise(t);
 for(const g of SYN) if(g.some(x=>normalise(x)===n)) return g.map(normalise);
 return [n];
}
function tokens(x){return normalise(x).split(' ').map(t=>t.replace(/^[.,;:!?]+|[.,;:!?]+$/g,'')).filter(t=>t&&!STOP.has(t)).map(stemToken)}
function lev(a,b){const n=b.length;let p=Array.from({length:n+1},(_,i)=>i),c=new Array(n+1);for(let i=1;i<=a.length;i++){c[0]=i;for(let j=1;j<=n;j++)c[j]=Math.min(c[j-1]+1,p[j]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));[p,c]=[c,p]}return p[n]}
function oppositeDirectionWords(a,b){
 const up=/^(?:increas(?:e|es)?|rise|rises|higher|greater|larger|positive|gain|gains)$/;
 const down=/^(?:decreas(?:e|es)?|fall|falls|lower|smaller|negative|lose|loses)$/;
 return (up.test(a)&&down.test(b))||(up.test(b)&&down.test(a));
}
function close(a,b){
 a=stemToken(a);b=stemToken(b);
 if(oppositeDirectionWords(a,b))return false;
 if(a===b)return true;
 for(const x of synonymSet(a))for(const y of synonymSet(b))if(stemToken(x)===stemToken(y))return true;
 const m=Math.max(a.length,b.length),d=lev(a,b);
 return (m>=9&&d<=2)||(m>=5&&d<=1);
}
function phraseScore(input,p){
 const a=tokens(input),b=tokens(p);if(!b.length)return 0;
 let hits=0;for(const t of b)if(a.some(x=>close(x,t)))hits++;
 let score=hits/b.length;
 const ni=normalise(input),np=normalise(p);
 if(np.length>=5&&ni.includes(np))score=1;
 return score;
}
function compact(x){
 return normalise(x).replace(/\bwork\b/g,'w').replace(/\bforce\b/g,'f').replace(/\bdisplacement\b|\bdistance\b/g,'s')
 .replace(/\btheta\b/g,'t').replace(/\bepsilon\b/g,'e').replace(/\blambda\b/g,'l').replace(/\bdelta\b/g,'d')
 .replace(/\bcos\b/g,'c').replace(/\bsin\b/g,'s').replace(/\btan\b/g,'t')
 .replace(/\*/g,'').replace(/\s+/g,'');
}
function formulaScore(input,expected){
 const a=compact(input),b=compact(expected);
 if(!a||!b)return 0;
 if(a===b)return 1;
 if(a.replace(/=/g,'')===b.replace(/=/g,''))return .95;
 return phraseScore(input,expected);
}
// AQA RP4: test each ion-colour association, not the presence of six unordered words.
// A swapped colour must never be credited as a fully correct halide identification.
function evaluateHalideColours(input){
 const raw=String(input||'').trim();
 if(!raw)return {status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};
 // Colour labels without their polarity are not evidence of a correct pair:
 // "chloride is not white" must not be marked as "chloride white".
 const negatedColour=/\b(?:no|not|never|isn't|isnt|doesn't|doesnt|aren't|arent)\b(?:\W+\w+){0,5}\W+(?:white|cream|yellow)\b/i.test(raw);
 const disownsAnswer=/\b(?:this|these|that|those)\s+(?:is|are)\s+(?:wrong|false|incorrect)\b/i.test(raw);
 if(negatedColour||disownsAnswer)return {status:'wrong',score:0,text:'The answer contradicts a precipitate colour; check the exact ion–colour pairing.',missing:['AgCl → white','AgBr → cream','AgI → yellow']};
 const labels=normalise(raw).match(/\b(?:agcl|agbr|agi|chloride|bromide|iodide|white|cream|yellow)\b/g)||[];
 const ions={agcl:'chloride',chloride:'chloride',agbr:'bromide',bromide:'bromide',agi:'iodide',iodide:'iodide'};
 const colours={chloride:'white',bromide:'cream',iodide:'yellow'};
 const correct=new Set();let invalid=0;
 for(let i=0;i+1<labels.length;i+=2){
   const left=labels[i],right=labels[i+1];
   const ion=ions[left]&&!ions[right]?ions[left]:(ions[right]&&!ions[left]?ions[right]:null);
   const colour=colours[ion];
   const observed=ion?(ions[left]?right:left):null;
   if(ion&&observed===colour&&!correct.has(ion))correct.add(ion);
   else invalid++;
 }
 if(labels.length%2||labels.length>6)invalid++;
 const hit=correct.size;
 const score=hit/3;
 const missing=Object.keys(colours).filter(ion=>!correct.has(ion)).map(ion=>ion+' → '+colours[ion]);
 if(hit===3&&invalid===0)return {status:'correct',score:1,text:'All three halide precipitate colours are paired correctly.',missing:[]};
 if(hit>=2)return {status:'partial',score,text:'Some pairs are right, but check every ion–colour association.',missing};
 return {status:'wrong',score,text:'The halide and precipitate colours must match, not merely be listed.',missing};
}
// Tollens' test: a silver-mirror phrase alone must not credit a claim about ketones
// or a negation of the aldehyde observation.
function evaluateTollensObservation(input){
 const raw=String(input||'').trim();
 if(!raw)return {status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};
 const s=raw.toLowerCase().replace(/[’‘]/g, String.fromCharCode(39));
 // In comparisons, "ketones give no silver mirror" is correct, unlike
 // "aldehydes give no silver mirror". Tie negations to the relevant subject.
 const ketoneNegative=/\bketones?\b.{0,45}\b(?:don't|doesn't|do not|does not|never|no)\b.{0,35}\b(?:silver|mirror|deposit)\b|\bketones?\b.{0,45}\b(?:give|gives|form|forms|produce|produces|show|shows)\s+no\b.{0,22}\b(?:silver|mirror|deposit)\b/i.test(s);
 const aldehydePositive=/\baldehydes?\b.{0,45}\b(?:give|gives|form|forms|produce|produces|show|shows)\b.{0,30}\b(?:silver|mirror|deposit)\b|\b(?:silver mirror|silver deposit)\b.{0,30}\b(?:for|from|with)\s+(?:an?\s+)?aldehydes?\b|\b(?:but|whereas|while|and)\s+aldehydes?\s+do\b(?!\s+(?:not|never))/i.test(s);
 const aldehydeNegative=/\baldehydes?\b.{0,40}\b(?:don't|doesn't|do not|does not|never|no|without)\b.{0,30}\b(?:silver|mirror|deposit)\b|\bno\s+silver\b.{0,20}\b(?:for|from|with)\b.{0,15}\baldehydes?\b/i.test(s);
 if(ketoneNegative&&aldehydePositive&&!aldehydeNegative)return {status:'correct',score:1,text:'Correct: aldehydes give a silver mirror; ordinary ketones do not.',missing:[]};
 const deniesSilver=/\b(?:no|not|never|without|none)\b.{0,25}\b(?:silver|mirror|deposit)\b|\b(?:don't|doesn't|do not|does not)\b.{0,25}\b(?:silver|mirror|deposit)\b/i.test(s);
 const claimsKetoneSilver=/\bketones?\b.{0,45}\b(?:give|gives|form|forms|produce|produces|show|shows)\b.{0,25}\b(?:silver|mirror|deposit)\b|\b(?:silver mirror|silver deposit)\b.{0,30}\b(?:for|with|from)\s+(?:a\s+)?ketones?\b/i.test(s);
 if(deniesSilver||claimsKetoneSilver)return {status:'wrong',score:0,text:'Aldehydes, rather than ordinary ketones, give the silver-mirror observation.',missing:['silver mirror or grey silver deposit for an aldehyde']};
 if(/\bsilver\s+(?:mirror|deposit|coating)\b|\b(?:grey|gray)\s+silver\b|\bmetallic\s+silver\b/i.test(s))return {status:'correct',score:1,text:'Correct positive Tollens’ observation.',missing:[]};
 if(/\bsilver\b/i.test(s))return {status:'partial',score:.5,text:'Specify a silver mirror or grey silver deposit.',missing:['silver mirror or grey silver deposit']};
 return {status:'wrong',score:0,text:'That is not the characteristic Tollens’ observation.',missing:['silver mirror or grey silver deposit']};
}

// For Year 1 Pure transformation cards, the direction/axis is the whole answer.
// Generic word-overlap marking can wrongly credit a left shift as a right shift.
function evaluateMathsPureTransform(c,input){
 const movement={
  maths_transform_001:'right',
  task1_maths_002:'right',
  maths_transform_002:'up',
  task1_v162_003:'left'
 };
 const axis={
  task1_maths_004:'y',
  task1_v162_002:'x'
 };
 const id=c?.id;
 if(!Object.prototype.hasOwnProperty.call(movement,id)&&
    !Object.prototype.hasOwnProperty.call(axis,id)&&
    id!=='task1_v162_001'&&id!=='maths_transform_003')return null;
 const raw=String(input||'').trim();
 if(!raw)return {status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};
 const n=normalise(raw).replace(/\b(?:not|never)\s+(?:to\s+the\s+)?(?:left|right|upwards?|downwards?)\b/g,' ');
 const good=(message)=>({status:'correct',score:1,text:message||'Correct transformation.',missing:[]});
 const bad=(missing)=>({status:'wrong',score:0,text:'The transformation direction, axis or scale factor is incorrect.',missing:[missing]});
 const partial=(missing)=>({status:'partial',score:.5,text:'State the precise direction, reflection axis or scale factor.',missing:[missing]});
 const direction={
  right:/\bright\b|\bpositive x\b/,
  left:/\bleft\b|\bnegative x\b/,
  up:/\bup\b|\bupward\b|\bupwards\b|\bpositive y\b/,
  down:/\bdown\b|\bdownward\b|\bdownwards\b|\bnegative y\b/
 };
 if(Object.prototype.hasOwnProperty.call(movement,id)){
  const wanted=movement[id],opposite={right:'left',left:'right',up:'down',down:'up'}[wanted];
  if(direction[opposite].test(n))return bad(wanted);
  if(direction[wanted].test(n))return good();
  return /\btranslate\b|\bshift\b|\bmove\b/.test(n)?partial(wanted):bad(wanted);
 }
 if(Object.prototype.hasOwnProperty.call(axis,id)){
  const wanted=axis[id],other=wanted==='x'?'y':'x';
  const expected=new RegExp('\\b'+wanted+'\\s*-?\\s*axis\\b');
  const incorrect=new RegExp('\\b'+other+'\\s*-?\\s*axis\\b');
  if(incorrect.test(n))return bad(wanted+'-axis');
  if(expected.test(n)||new RegExp('\\breflect(?:ion)?\\s+in\\s+the\\s+'+wanted+'\\s*axis\\b').test(n))return good();
  return /\breflect\b|\breflection\b/.test(n)?partial(wanted+'-axis'):bad(wanted+'-axis');
 }
 if(id==='task1_v162_001'){
  const wrong=/\bhorizontal(?:ly)?\b|\bx[\s-]*axis\b/.test(n);
  const right=/\bvertical(?:ly)?\b|\by[\s-]*coordinate/.test(n);
  if(wrong)return bad('vertical stretch by scale factor a');
  if(right&&(/\bstretch\b|\bscale\b|\bmultiply\b|\bfactor\b/.test(n)))return good();
  return right?partial('vertical stretch by scale factor a'):bad('vertical stretch by scale factor a');
 }
 if(id==='maths_transform_003'){
  const wrong=/\b(?:multiply|multiplied|times)\b.{0,22}\b(?:by\s+)?a\b|\bscale\s+factor\s+a\b/.test(n);
  if(wrong)return bad('1/a');
  if(/1\s*\/\s*a\b|\b(?:one|1)\s+over\s+a\b|\bdivid(?:e|ed|ing)\s+(?:each\s+)?(?:x\s+)?(?:coordinate(?:s)?\s+)?by\s+a\b/.test(n))return good();
  return /\bhorizontal\b|\bscale\b|\bcoordinate\b/.test(n)?partial('1/a'):bad('1/a');
 }
 return null;
}


// v251: narrowly scoped number + unit matching for explicitly configured mock cards.
// Exact curated text answers still work through the existing marker. Other cards
// retain their current strict or flexible marking semantics.
function evaluateConfiguredNumericRecall(c,input){
 const config=c?.numericRecall;
 if(!config)return null;
 const s=String(input||'').trim().replace(/[−–]/g,'-');
 // Only a bare scalar and a recognised physical unit qualify: never pick a
 // number out of prose or ignore an incorrect unit/direction.
 // Only a standalone number with an explicitly allowed unit qualifies.
 // Bare numbers are permitted only for individually configured dimensionless cards.
 // Accept ordinary or scientific notation (E, x10^n or superscripts) only
 // for cards explicitly opting in to numericRecall. Preserve strict text for ions.
 const match=s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*(?:[x×*·]\s*10\s*(?:\^\s*(?:\(\s*[-+]?\d+\s*\)|[-+]?\d+)|[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)|[eE][+-]?\d+))?)\s*(kJ\/mol|kJ\s*mol(?:\^-?1|⁻¹)|J\/mol|J\s*mol(?:\^-?1|⁻¹)|kΩ|Ω|ohms?|mA|A|mV|V|mW|W|kHz|Hz|m\/s|µs|μs|ms|s|mm|nm|mol|m|N|°|degrees?|kJ|J)?\s*\.?$/i);
 if(!match)return null;
 // Keep this small parser self-contained for the existing flashcard-marking
 // regression harness, which evaluates this module independently of exam maths.
 const superscriptDigits={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
 const scientific=match[1].match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*[x×*·]\s*10\s*(?:\^\s*(?:\(\s*([-+]?\d+)\s*\)|([-+]?\d+))|([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+))$/i);
 const power=scientific?(scientific[2]||scientific[3]||[...(scientific[4]||'')].map(d=>superscriptDigits[d]).join('')):null;
 const numeric=scientific?Number(scientific[1])*10**Number(power):Number(match[1]);
 const units=config.units||[];
 // The expected number of significant figures is an explicit per-card rule,
 // not a global numeric-marking guess (trailing zeros can carry precision).
 if(Number.isInteger(config.significantFigures)&&config.significantFigures>0){
  const coefficient=match[1].match(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)/)?.[0]||'';
  const figures=coefficient.replace(/\D/g,'').replace(/^0+/,'').length||1;
  if(figures!==config.significantFigures)
   return {status:'wrong',score:0,text:'Give the result to the requested significant figures.',missing:[config.expected]};
 }
 let reading;
 if(!match[2]){
  if(!config.allowUnitless)return {status:'wrong',score:0,text:'Give the answer with the required unit.',missing:[config.expected]};
  reading=numeric;
 }else{
  const unit=units.find(u=>String(u.symbol).toLowerCase()===match[2].toLowerCase());
  if(!unit)return {status:'wrong',score:0,text:'Check the required physical units.',missing:[config.expected]};
  reading=numeric*unit.toBase;
 }
 const target=Number(config.value);
 if(!Number.isFinite(reading)||!Number.isFinite(target))return {status:'wrong',score:0,text:'Check the numerical value.',missing:[config.expected]};
 // Avoid a fixed 1e-12 tolerance accepting wildly incorrect 1e-16 J answers.
 const tolerance=Number.isFinite(config.tolerance)&&config.tolerance>0?config.tolerance:Math.max(1e-30,Math.abs(target)*1e-4);
 if(Math.abs(reading-target)<=tolerance)
  return {status:'correct',score:1,text:'Correct equivalent numerical value and unit.',missing:[]};
 return {status:'wrong',score:0,text:'The numerical value or unit conversion is incorrect.',missing:[config.expected]};
}
function evaluateCard(c,input){
 // v334: do not extract a one-letter answer such as T (tera) from the
 // apostrophe in "don't", "can't" or "haven't" when the student supplied
 // a complete non-answer. Preserve real answers such as T or "it is T".
 const nonAnswer=String(input||'').trim().toLowerCase()
  .replace(/’/g,"'").replace(/^[\s,.!?]+|[\s,.!?]+$/g,'')
  .replace(/^sorry[,!]?\s*/,'');
 if(/^(?:i\s+(?:just\s+)?(?:(?:don't|do\s+not)\s+(?:think\s+i\s+)?know|(?:can't|cannot)\s+(?:remember|answer(?:\s+that)?)|couldn't\s+tell\s+you|haven't\s+(?:a\s+clue|got\s+it)|wasn't\s+sure)|i(?:'m|\s+am)\s+(?:stuck|not\s+sure)|idk|no\s+idea|not\s+sure)$/.test(nonAnswer))
  return {status:'wrong',score:0,text:'No answer was supplied; review this card and try again.',missing:[]};
 // v297: explicitly denying an entire listed correct answer must not be
 // credited via fuzzy token overlap or a model substring match. Scope this
 // only to a standalone 'not [exact answer]' response, not ordinary prose
 // containing a valid explanatory contrast.
 const rawForNegation=String(input||'').trim();
 const standaloneDenial=rawForNegation.match(/^not\s+(.+)$/i);
 if(standaloneDenial){
  const denied=normalise(standaloneDenial[1].replace(/[.!?]+$/,''));
  if(denied && [c?.back,...(Array.isArray(c?.accept)?c.accept:[])].some(a=>normalise(String(a||'').replace(/[.!?]+$/,''))===denied))
   return {status:'wrong',score:0,text:'This explicitly denies the correct answer.',missing:[String(c?.back||'')]};
 }
 // v302: guide-style flashcards have separately markable, ordered blanks.
 // Do not use fuzzy token overlap: swapped ion colours, opposing signs and
 // reversed graph directions must never earn full marks.
 if(c?.method==='fill gaps' && Array.isArray(c.clozeParts) &&
    (c.id?.startsWith('task1_v298_')||c.v326ExactReviewed===true)){
  const raw=String(input||'').trim();
  if(!raw)return {status:'neutral',score:0,text:'Enter the missing words or values.',missing:[]};
  const n=t=>normalise(String(t||'').replace(/[.!?]+$/,''));
  const correct=[c.back,...(Array.isArray(c.accept)?c.accept:[])];
  if(Array.isArray(c.reject)&&c.reject.some(x=>n(x)===n(raw)))
   return {status:'wrong',score:0,text:'That answer contains incorrect information.',missing:[]};
  if(correct.some(x=>n(x)===n(raw)))
   return {status:'correct',score:1,text:'All blanks are correct.',missing:[]};
  const supplied=raw.split(/\s*(?:;|,|\n|\||\s+and\s+|\s+\/\s+)\s*/i).map(x=>x.trim());
  if(supplied.length!==c.clozeParts.length)
   return {status:'wrong',score:0,text:'Enter each blank in order, separated by commas or semicolons.',missing:c.clozeParts.map((_,i)=>'Blank '+(i+1))};
  let hits=0;const missing=[];
  c.clozeParts.forEach((options,i)=>{
   if(Array.isArray(options)&&options.some(x=>n(x)===n(supplied[i])))hits++;
   else missing.push('Blank '+(i+1));
  });
  if(hits===c.clozeParts.length)return {status:'correct',score:1,text:'All blanks are correct.',missing:[]};
  if(hits>0)return {status:'partial',score:hits/c.clozeParts.length,text:'Some blanks are correct; check their order and meaning.',missing};
  return {status:'wrong',score:0,text:'The blanks are not correct yet.',missing};
 }
 // Formula cards with meaningful primes must keep the derivative operator.
 // General punctuation normalisation otherwise makes f(a)=0 look like f′(a)=0.
 if(c?.strictSymbolRecall===true){
  const raw=String(input||'').trim();
  if(!raw)return {status:'neutral',score:0,text:'Compare your attempt with the model.',missing:[]};
  const symbolKey=t=>String(t||'').trim().toLowerCase().replace(/[’′]/g,"'").replace(/\s+/g,'').replace(/[.]$/,'');
  const valid=[c.back,...(c.accept||[])].some(x=>symbolKey(x)===symbolKey(raw));
  return valid?{status:'correct',score:1,text:'Correct exact notation or accepted explanation.',missing:[]}:
   {status:'wrong',score:0,text:c.strictSymbolFeedback||'A stationary point needs the first derivative to equal zero.',missing:[c.back]};
 }
 // v316: the existing specialist graph-transform marker can override even an
 // explicitly accepted exact paraphrase (or partially credit a vetted wrong one).
 // Honour exact, punctuation-preserving examples ONLY on the 60 individually
 // reviewed core cards, before any fuzzy/numeric/transform scoring.
 if((c?.v316ExactReviewed===true&&c.mock===true)||c?.v321ExactReviewed===true||c?.v322ExactReviewed===true||c?.v324ExactReviewed===true||c?.v326ExactReviewed===true||c?.v327ExactReviewed===true||c?.v328ExactReviewed===true||c?.v329ExactReviewed===true||c?.v330ExactReviewed===true||c?.v331ExactReviewed===true||c?.v332ExactReviewed===true||c?.v343ExactReviewed===true){
  const exact=t=>String(t||'').trim().toLowerCase().replace(/\s+/g,' ').replace(/[.]$/,'');
  const key=exact(input);
  if(key&&Array.isArray(c.reject)&&c.reject.some(x=>exact(x)===key))
   return {status:'wrong',score:0,text:'That matches a verified incorrect answer.',missing:[String(c.back||'')]};
  if(key&&[c.back,...(Array.isArray(c.accept)?c.accept:[])].some(x=>exact(x)===key))
   return {status:'correct',score:1,text:'Correct reviewed answer.',missing:[]};
 }
 const numerical=evaluateConfiguredNumericRecall(c,input);
 if(numerical)return numerical;
 // Heat-energy *magnitude* needs absolute-value notation: normalise() strips |.
 if(c?.id==='task1_v189_chem_001'){
  const raw=String(input||'').trim();
  if(!raw)return {status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};
  const magnitude=/\|\s*(?:Δ|δ|∆|delta\s*)h\s*\||\b(?:absolute\s+value|magnitude|modulus)\b|\babs\s*\(/i;
  if(!magnitude.test(raw))return {status:'wrong',score:0,text:'Use the magnitude |ΔH| here, not the signed ΔH.',missing:['absolute value |ΔH|']};
  if(normalise(c.back)===normalise(raw)||(c.accept||[]).some(a=>normalise(a)===normalise(raw)))
   return {status:'correct',score:1,text:'Correct heat-magnitude formula.',missing:[]};
  return {status:'wrong',score:0,text:'Use q = n × |ΔH|, with matching energy units.',missing:['q = n × |ΔH|']};
 }
 const mathsTransform=evaluateMathsPureTransform(c,input);
 if(mathsTransform)return mathsTransform;
 if(c.id==='chem_rp4')return evaluateHalideColours(input);
 if(c.id==='chem_aldehyde_tollens')return evaluateTollensObservation(input);
  // Context-specific threshold-frequency marking, including the difference
  // between zero measured KE and no emitted photoelectrons.
  if(c.id===window.RevisionPhotoelectricCardMarking?.TARGET_ID)
    return window.RevisionPhotoelectricCardMarking.evaluate(input);
 // v233: reject known conceptual reversals before fuzzy similarity can credit them.
 // Unlisted correct paraphrases still use the normal flexible marking path.
 const chemRaw=String(input||'').trim();

 // v235: narrow accepted paraphrases and explicit wrong-answer examples for
 // 15 pre-existing school-taught Chemistry recall cards (acids, Kw, Kp, Gibbs).
 // Unknown responses still receive the usual marking, not blanket acceptance.
 const v235ChemRecall={"task1_chem_174":{"right":["An acid donates H+ ions.","A proton donor."],"wrong":["A proton acceptor.","It accepts a hydrogen ion."]},"task1_chem_175":{"right":["A base accepts H+ ions.","A proton acceptor."],"wrong":["A proton donor.","It gives away a hydrogen ion."]},"task1_chem_177":{"right":["An acid that completely ionises in water.","It dissociates fully in aqueous solution."],"wrong":["A highly concentrated acid.","An acid that only partially ionises in water."]},"task1_chem_178":{"right":["An acid which only partly ionises in water.","A weak acid is partially dissociated in aqueous solution."],"wrong":["An acid that dissociates completely in water.","An acid with high concentration."]},"task1_chem_180":{"right":["A larger Ka means a stronger acid.","A larger acid dissociation constant indicates stronger acid."],"wrong":["A weaker acid.","The acid dissociates less as Ka increases."]},"task1_v125_144":{"right":["mol dm^-3.","moles per cubic decimetre."],"wrong":["mol^2 dm^-6.","No units."]},"task1_v125_147":{"right":["Fourteen.","14."],"wrong":["7.","pH plus pOH is 7."]},"chem_kw_001":{"right":["One times ten to the minus fourteen mol squared per dm to the six, and equals [H+][OH-].","Kw = 1 x 10^-14 at 298 K, the product of hydrogen and hydroxide ion concentrations."],"wrong":["Kw = [H+]/[OH-] = 10^-14.","Kw = [H+][OH-] = 1 x 10^-7 at 298 K."]},"chem_kp_temp":{"right":["Only temperature.","Kp changes when temperature changes."],"wrong":["Total pressure.","Changing a catalyst changes Kp."]},"chem_kp_pressure":{"right":["No, Kp is constant at constant temperature.","Kp stays unchanged; the equilibrium position may shift."],"wrong":["Yes, pressure increases Kp.","Increasing the pressure always increases Kp."]},"chem_kp_recap_20261024_temp_exothermic":{"right":["Kp falls when temperature rises.","Heating an exothermic reaction decreases Kp."],"wrong":["Kp increases.","The equilibrium constant rises when heated."]},"chem_kp_recap_20261024_temp_endothermic":{"right":["Kp increases with temperature.","Heating shifts the equilibrium constant upwards."],"wrong":["Kp decreases on heating.","Kp stays constant even if temperature changes."]},"chem_gibbs_feasible":{"right":["Forward reaction is thermodynamically possible.","Feasible in the forward direction at these conditions."],"wrong":["The reaction must be very fast.","The forward process is thermodynamically impossible."]},"chem_entropy_gibbs_recap_20261024_catalyst_gibbs":{"right":["No, it decreases activation energy but not delta G.","A catalyst only speeds a reaction; it does not change Gibbs free energy."],"wrong":["A catalyst makes ΔG more negative.","Catalysts lower delta G and change feasibility."]},"chem_entropy_gibbs_recap_20261024_signs_high_temp":{"right":["Positive enthalpy and positive entropy changes.","Both delta H and delta S are positive."],"wrong":["Negative enthalpy and negative entropy.","Both delta H and delta S are negative."]}};
 if(c?.subject==='Chemistry'&&chemRaw&&v235ChemRecall[c.id]){
  const v235=v235ChemRecall[c.id];
  if(v235.right.some(answer=>normalise(answer)===normalise(chemRaw)))
   return {status:'correct',score:1,text:'Correct scientifically equivalent wording.',missing:[]};
  if(v235.wrong.some(answer=>normalise(answer)===normalise(chemRaw)))
   return {status:'wrong',score:0,text:'Incorrect chemical meaning, numerical value or direction. Check the model answer.',missing:[]};
 }


 // v234: concept-level precision for nine historical AS Chemistry mock cards.
 // Exact vetted equivalents are credited; known opposite meanings and wrong bond
 // angles are rejected before the fuzzy marker can award partial credit.
 // All other answers continue through the normal flexible scoring system.
 const v234ChemRecall={"chem_electrophile":{"right":["A species that accepts an electron pair.","Electron pair acceptor."],"wrong":["An electron-pair donor.","A particle that donates a pair of electrons."]},"chem_nucleophile":{"right":["A species that donates an electron pair.","Electron pair donor."],"wrong":["An electron-pair acceptor.","A particle that accepts a pair of electrons."]},"chem_homolytic":{"right":["Each atom gets one electron from the bond, forming radicals.","One bonding electron goes to each atom."],"wrong":["Both bonding electrons are taken by one atom, forming ions.","Heterolytic fission: both electrons go to the same atom."]},"chem_heterolytic":{"right":["Both electrons in the bond go to one atom and ions form.","One atom takes the bonding pair leaving ions."],"wrong":["Each atom gets one electron, producing radicals.","The electron pair is split equally and free radicals form."]},"chem_metallic_bond":{"right":["Attraction between metal cations and mobile delocalised electrons.","Electrostatic forces between positive metal ions and delocalised electrons."],"wrong":["Electrostatic attraction between positive and negative ions in an ionic lattice.","Attraction between oppositely charged metal ions."]},"chem_shape_linear":{"right":["180 degrees.","180°."],"wrong":["120 degrees.","109.5°."]},"chem_shape_trig":{"right":["120 degrees.","120°."],"wrong":["109.5 degrees.","180°."]},"chem_shape_tetra":{"right":["109.5 degrees.","109.5°."],"wrong":["120 degrees.","90°."]},"chem_bonding_v47_38":{"right":["Intermolecular hydrogen bonds are partially disrupted; covalent O-H bonds stay intact.","Some hydrogen bonds between water molecules are broken."],"wrong":["The covalent O-H bonds are broken when ice melts.","Water molecules split into H and O atoms as ice melts."]}};
 if(c?.subject==='Chemistry'&&chemRaw&&v234ChemRecall[c.id]){
  const v234=v234ChemRecall[c.id];
  if(v234.right.some(answer=>normalise(answer)===normalise(chemRaw)))
   return {status:'correct',score:1,text:'Correct scientifically equivalent wording.',missing:[]};
  if(v234.wrong.some(answer=>normalise(answer)===normalise(chemRaw)))
   return {status:'wrong',score:0,text:'This reverses the chemistry or gives an incorrect bond angle. Compare the model answer.',missing:[]};
 }

 if(chemRaw){
  // Exact scientifically equivalent alternatives get full credit before fuzzy matching.
  const acceptedChem={
   chem_lattice_diss:['The enthalpy change when one mole of ionic solid breaks into gaseous ions.','The enthalpy change when one mole of ionic lattice is separated into gaseous ions.','The enthalpy change when one mole of ionic solid forms separate gaseous ions.'],
   chem_lattice_form:['Equal magnitude and opposite signs.','The negative of lattice dissociation enthalpy.'],
   chem_ea1:['The enthalpy change when one mole of gaseous atoms each gain an electron to form gaseous negative ions.','The enthalpy change when one mole of gas atoms each accepts an electron to form 1- ions.'],
   task1_chem_182:['Kw is [H+][OH-].','The product of hydrogen ion and hydroxide ion concentrations.'],
   chem_energetics_v49_08:['100 kPa.','The standard pressure is one hundred kilopascals.'],
   chem_energetics_v49_11:['It is zero by definition.','Zero.'],
   task1_chem_179:['The acid dissociation equilibrium constant.','The equilibrium constant for HA ionising in water.']
  };
  if((acceptedChem[c.id]||[]).some(a=>normalise(a)===normalise(chemRaw)))
   return {status:'correct',score:1,text:'Correct equivalent scientific statement.',missing:[]};
  const badChem=()=>({status:'wrong',score:0,text:'The scientific direction, sign, value or relationship is incorrect. Compare it with the model answer.',missing:[]});
  if(c.id==='chem_lattice_diss'&&(
   /\b(?:gaseous\s+)?ions?\b.*\b(?:form(?:s|ing)?|join\w*|combin\w*)\b.*\b(?:solid|lattice)\b/i.test(chemRaw)
   || /\bform(?:ation|ing)?\b\s+(?:(?:of|one\s+mole\s+of|an?|the)\s+)*(?:ionic\s+)?(?:solid|lattice)\b/i.test(chemRaw)
  )&&!/\b(?:separat\w*|dissociat\w*|break\w*|split\w*|disassembl\w*)\b/i.test(chemRaw))return badChem();
  // A definition lacking its one-mole or enthalpy requirement is incomplete, not fully correct.
  if(c.id==='chem_lattice_diss'&&/\b(?:solid|lattice)\b/i.test(chemRaw)
    &&/\b(?:gaseous|gas)\b/i.test(chemRaw)&&/\bions?\b/i.test(chemRaw)
    &&/\b(?:separat\w*|dissociat\w*|break\w*|split\w*|form\w*)\b/i.test(chemRaw)
    &&(!/\b(?:one\s+mole|1\s*mol(?:e)?)\b/i.test(chemRaw)|| !/\b(?:enthalpy|heat\s+change|delta\s*h)\b|ΔH/i.test(chemRaw)))
    return {status:'partial',score:0.5,text:'Include the enthalpy change for one mole of solid ionic lattice becoming gaseous ions.',missing:['enthalpy change','one mole']};
  if(c.id==='chem_ea1'&&/\b(?:gaseous|gas)\b/i.test(chemRaw)&&/\batoms?\b/i.test(chemRaw)
    &&/\b(?:gain\w*|accept\w*|receiv\w*)\b/i.test(chemRaw)&&/\belectrons?\b/i.test(chemRaw)
    &&(!/\b(?:one\s+mole|1\s*mol(?:e)?)\b/i.test(chemRaw)|| !/\b(?:enthalpy|heat\s+change|delta\s*h)\b|ΔH/i.test(chemRaw)))
    return {status:'partial',score:0.5,text:'Include the enthalpy change for one mole of gaseous atoms, each gaining one electron.',missing:['enthalpy change','one mole']};
  if(c.id==='chem_lattice_form'&&/\bsame\s+(?:the\s+)?sign\b/i.test(chemRaw)
    && !/\bnot\s+(?:the\s+)?same\s+sign\b|\bopposite\s+sign\b/i.test(chemRaw))return badChem();
  if(c.id==='chem_ea1'&&/\b(?:los(?:e|es|ing|t)|remov(?:e|es|ing|al))\b/i.test(chemRaw)
    && !/\b(?:gain\w*|accept\w*|add\w*)\b/i.test(chemRaw))return badChem();
  if(c.id==='task1_chem_182'){
   const compact=chemRaw.toLowerCase().replace(/[⁺]/g,'+').replace(/[⁻−]/g,'-').replace(/\s+/g,'');
   if(/\]\s*\/\s*\[/.test(chemRaw)||/h\+?\]?\/\[?oh-?/.test(compact)
      ||(/\b(?:ratio|quotient|divid(?:e|ed|ing))\b/i.test(chemRaw)&&/\b(?:hydrogen|h\+)/i.test(chemRaw)&&/\b(?:hydroxide|oh-)/i.test(chemRaw)))return badChem();
  }
  if(c.id==='chem_energetics_v49_08'&&/\b(?:101\s*(?:kpa|kilopascal)|101325\s*pa)\b/i.test(chemRaw)
    && !/\bnot\s+101\b/i.test(chemRaw))return badChem();
  if(c.id==='chem_energetics_v49_11'&&/\b(?:not\s+(?:equal\s+to\s+)?zero|non[-\s]?zero)\b/i.test(chemRaw))return badChem();
  if(c.id==='task1_chem_179'&&/\brate\s+constant\b/i.test(chemRaw)&& !/\bequilibri\w*\b/i.test(chemRaw))return badChem();
 }
 if(String(input||'').trim()&&(normalise(c.back)===normalise(input)||(Array.isArray(c.accept)&&c.accept.some(a=>normalise(a)===normalise(input)))))return {status:'correct',score:1,text:'Correct answer or accepted equivalent wording.',missing:[]};
 if(!String(input||'').trim())return {status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};
 if(Array.isArray(c.reject)&&c.reject.some(a=>normalise(a)===normalise(input)))return {status:'wrong',score:0,text:'This is an incorrect alternative. Compare it with the accepted answer.',missing:[]};
 // Precise labels, such as Fe(II) and Fe(III), must match explicit accepted variants.
 if(c.strictRecall===true){
  // v293: a Physics or Maths answer should not receive an unrelated ion/oxidation-state hint.
  // Preserve every older card's original feedback and strict grading.
  const concise=c.id?.startsWith('task1_v293_');
  const hint=concise?(c.subject==='Maths'?'Check the calculation, transformation or mathematical notation.':
   c.subject==='Physics'?'Check the unit, direction or physical relationship.':
   'Check the chemical test, product or exact definition.'):'Check the exact ion or oxidation state against the accepted answer.';
  return {status:'wrong',score:0,text:hint,missing:[]};
 }
 // v336: require essential parts of five precise definitions before fuzzy
 // word overlap can confer a full mark. Authored correct paraphrases still work.
 if(c?.subject==='Chemistry'&&[
  'task1_chem_017','task1_v125_121','task1_v127_074','task1_v130_084','task1_v130_085'
 ].includes(c.id)){
  const rules={
   task1_chem_017:[
    [/\bconcentrat\w*\b/i,'concentration'],
    [/\b(?:accurat\w*|precis\w*|exact\w*)\b/i,'accurately known']
   ],
   task1_v125_121:[
    [/\b(?:energy|enthalpy|heat|work)\b/i,'energy required'],
    [/\b(?:remov\w*|detach\w*)\b/i,'removing'],
    [/\belectrons?\b/i,'electron'],
    [/\b(?:gaseous|gas)\b/i,'gaseous atoms'],
    [/\b(?:one|1|a)\s*(?:mol(?:e)?s?)\b/i,'one mole']
   ],
   task1_v127_074:[
    [/\b(?:enthalpy|heat|energy)\b/i,'enthalpy change'],
    [/\b(?:one|1|a)\s*(?:mol(?:e)?s?)\b/i,'one mole'],
    [/\bdissolv\w*\b/i,'dissolving'],
    [/\binfinit\w*\b/i,'infinite dilution'],
    [/\bdilut\w*\b/i,'infinite dilution']
   ],
   task1_v130_084:[
    [/\b(?:enthalpy|heat|energy)\b/i,'enthalpy change'],
    [/\bacid\b/i,'acid'],
    [/\b(?:base|alkali|neutralis\w*|neutraliz\w*)\b/i,'base or neutralisation'],
    [/\b(?:one|1|a)\s*(?:mol(?:e)?s?)\b/i,'one mole'],
    [/\bwater\b/i,'water'],
    [/\bdilut\w*\b/i,'dilute solution'],
    [/\bstandard\b/i,'standard conditions']
   ],
   task1_v130_085:[
    [/\b(?:enthalpy|heat|energy)\b/i,'enthalpy change'],
    [/\b(?:one|1|a)\s*(?:mol(?:e)?s?)\b/i,'one mole'],
    [/\b(?:gaseous|gas)\s+atoms?\b/i,'gaseous atoms'],
    [/\belement\b/i,'element'],
    [/\bstandard\s+(?:conditions|enthalpy)\b/i,'standard enthalpy or standard conditions']
   ]
  }[c.id];
  const missing=rules.filter(([regex])=>!regex.test(String(input||''))).map(([,label])=>label);
  if(missing.length){
   const score=(rules.length-missing.length)/rules.length;
   return {status:score>=.45?'partial':'wrong',score,text:'The definition is missing required scientific details.',missing};
  }
 }
 let best=0,missing=[];
 for(const alt of (c.accept||[]))best=Math.max(best,formulaScore(input,alt),phraseScore(input,alt));
 if(c.concepts?.length){
   let hit=0;missing=[];
   for(const g of c.concepts){
     const opts=Array.isArray(g)?g:[g];let gb=0;
     for(const o of opts)gb=Math.max(gb,formulaScore(input,o),phraseScore(input,o));
     if(gb>=.6)hit++;else missing.push(opts[0]);
   }
   best=Math.max(best,hit/c.concepts.length);
 }
 if(!c.accept&&!c.concepts)best=Math.max(phraseScore(input,c.back),formulaScore(input,c.back));
 if(contradicts(input,c.back))best=Math.min(best,.25);
 if(best>=.78)return {status:'correct',score:best,text:'Correct. Equivalent wording, common notation and ordinary spelling mistakes are accepted.',missing:[]};
 if(best>=.45)return {status:'partial',score:best,text:'Partly correct. Check the missing key idea(s) below.',missing};
 return {status:'wrong',score:best,text:'Not enough of the required physics/chemistry/maths content matched yet.',missing};
}
function importantTokens(s){
 return tokens(s).filter(x=>x.length>=3&&!['mark','obtain','calculate','state','give','identify','use','correct','answer','approximately','about'].includes(x));
}
function markPointPrediction(answer,point){
 if(!String(answer||'').trim())return 0;
 if(contradicts(answer,point))return 0;
 if(normalise(answer).includes(normalise(point))&&normalise(point).length>6)return 1;
 const p=importantTokens(point),a=tokens(answer);if(!p.length)return 0;
 let hits=0;for(const target of p)if(a.some(x=>close(x,target)))hits++;
 let score=hits/p.length;
 // Compare complete numerical tokens, never substring digits: "12345" cannot
 // match "2", "3" and "4" or win multiple marks on its own.
 const pnums=(normalise(point).match(/(?<![\w.])[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?(?![\w.])/g)||[]);
 const anums=(normalise(answer).match(/(?<![\w.])[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?(?![\w.])/g)||[]);
 if(pnums.length&&anums.length){
  const nHits=pnums.filter(v=>anums.some(w=>{
    if(v===w)return true;
    const x=Number(v),y=Number(w);
    return Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<=Math.max(Math.abs(x)*.002,1e-12);
  })).length;
  if(nHits>0)score=Math.max(score,nHits/pnums.length);
 }
 const phrases=String(point).split(/\/|;|\bor\b/i).map(x=>x.trim()).filter(x=>x.length>4);
 for(const ph of phrases)score=Math.max(score,phraseScore(answer,ph));
 return clamp(score,0,1);
}

function parseNumber(s){
 let x=String(s||'').replace(/[−–—]/g,'-').replace(/×|·/g,'x').replace(/,/g,'');
 const supmap={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
 // Typed scientific notation also arrives with true superscript exponents.
 x=x.replace(/10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)/g,(_,sup)=>'10^'+[...sup].map(ch=>supmap[ch]).join(''));
 x=x.replace(/10\s*\^\s*\(\s*([-+]?\d+)\s*\)/g,'10^$1');

 // Remove trailing dimensional indices: mol-1, cm3, kg m-2 and s^-1 are units, not final answers.
 x=x.replace(/\b(?:mol|kg|cm|mm|dm|km|ms|hz|m|s)\s*(?:\^\s*)?[-+]?\d+\b/gi,' ');
 // Also recognise standalone fractions such as 2/3, without misreading the denominator as the final answer.
 const fraction=x.trim().match(/^(?:(?:[a-zA-Z]\w*|[a-zA-Z]\([^)]*\))\s*=\s*)?([-+]?\d+(?:\.\d+)?)\s*\/\s*([-+]?\d+(?:\.\d+)?)\s*(?:[a-zA-ZµμΩ%°\s]+)?$/);
 if(fraction&&Number(fraction[2])!==0)return Number(fraction[1])/Number(fraction[2]);
 const pat=/[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*(?:x|\*)\s*10\s*\^\s*[-+]?\d+|e[-+]?\d+)?/gi;
 const values=[...x.matchAll(pat)].map(m=>{
  const z=m[0].replace(/\s/g,'');
  const sci=z.match(/^([-+]?(?:\d+(?:\.\d*)?|\.\d+))(?:x|\*)10\^([-+]?\d+)$/i);
  return sci?Number(sci[1])*10**Number(sci[2]):Number(z);
 }).filter(Number.isFinite);
 return values.length?values[values.length-1]:NaN;
}
function numericMatch(q,answer){
 if(q.answerType!=='numeric'||!Number.isFinite(q.numericAnswer))return false;
 let text=String(answer||'').trim();
 if(!text)return false;
 // Remove final presentation notes which are not numerical answers.
 text=text.replace(/\(\s*\d+\s*(?:s\.?f\.?|significant\s+figures?)\s*\)\s*$/i,'').trim();
 text=text.replace(/(?:\s*,?\s*valid\s+(?:since|because)\s+[a-z]+\s*[><]\s*\d+(?:\.\d+)?)\s*$/i,'').trim();
 // Sentence-final punctuation must not conceal an otherwise explicit unit.
 // E.g. '8 cm.' is not an answer of '8 m'.
 text=text.replace(/[.!?]\s*$/,'').trim();
 let n=parseNumber(text);
 // Scale tolerance to the actual answer, including very small scientific-notation
 // quantities. A fixed 1e-9 floor wrongly treats zero as a valid 1e-11 result.
 const expected=q.numericAnswer;
 const requestedTol=Number.isFinite(q.tolerance)&&q.tolerance>=0?q.tolerance:
   (expected===0?1e-9:Math.abs(expected)*.01);
 // Imported practice problems can contain absurd absolute tolerances, e.g.
 // 1e-13 for an answer near 1e-21. Do not accept zero, an incorrect exponent
 // or an unrelated magnitude as an equivalent numerical answer.
 const tol=expected===0?requestedTol:Math.min(requestedTol,Math.abs(expected)*.05);
 // Where an answer explicitly gives a recognisable unit, reject or
 // correctly convert a unit that conflicts with the requested quantity.
 // AQA frequently awards full marks for the right final result on ordinary
 // calculation questions; that does not make "8 cm" equivalent to "8 m".
 const units={mm:['length',.001],cm:['length',.01],m:['length',1],km:['length',1000],
  mg:['mass',.001],g:['mass',1],kg:['mass',1000],
  mj:['energy',.001],megaj:['energy',1e6],j:['energy',1],kj:['energy',1000],
  mw:['power',.001],megaw:['power',1e6],w:['power',1],kw:['power',1000],
  mv:['voltage',.001],v:['voltage',1],kv:['voltage',1000],
  ma:['current',.001],a:['current',1],
  pa:['pressure',1],kpa:['pressure',1000],mpa:['pressure',1e6],
  ohm:['resistance',1],'%':['percent',1],n:['force',1],
  mol:['amount',1],hz:['frequency',1],ev:['energy-electronvolts',1],
  s:['time',1],seconds:['time',1],ms:['time',1e-3],'µs':['time',1e-6],ns:['time',1e-9],nm:['length',1e-9],'µm':['length',1e-6],year:['years',1],years:['years',1]};
 // SI prefixes are case sensitive: mJ is a millijoule; MJ is a megajoule.
 // Earlier lower-casing treated MJ as mJ and MW as mW.
 const physicalUnitKey=s=>s==='MJ'?'megaj':s==='MW'?'megaw':s.replace(/Ω/g,'ohm').replace(/μ/g,'µ').toLowerCase();
 const expectedUnit=physicalUnitKey(String(q.unit||'').trim());
 // A final numeric answer can use powers of ten written as E notation,
 // x10^(-3) or true superscripts. Parse the WHOLE number before its unit:
 // reading only '-3 m' from '2.5 × 10⁻³ m' silently rejects a valid answer.
 const statedUnit=text.match(/(?:^|[=\s])([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*(?:[x×*·]\s*10\s*(?:\^\s*(?:\(\s*[-+]?\d+\s*\)|[-+]?\d+)|[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)|e[-+]?\d+))?)\s*(mm|cm|km|nm|[µμ]m|m|mg|kg|g|mJ|kJ|J|mW|kW|W|mV|kV|V|mA|A|kPa|MPa|Pa|ohm|Ω|%|mol|Hz|eV|N|seconds|years?|ms|[µμ]s|ns|s)\s*$/i);
 if(units[expectedUnit]&&statedUnit){
  const givenUnit=physicalUnitKey(statedUnit[2]);
  const left=units[givenUnit],right=units[expectedUnit];
  if(!left||left[0]!==right[0])return false;
  const converted=parseNumber(statedUnit[1])*left[1]/right[1];
  return Number.isFinite(converted)&&Math.abs(converted-expected)<=tol;
 }
 if(Number.isFinite(n)&&Math.abs(n-expected)<=tol)return true;
 // SI-unit equivalence: 2.94 kW and 2940 W may represent the same power.
 const unit=text.match(/([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*(kW|kJ|km|cm|mm|mW|mJ|mA|ms|µs|μs|nm|kPa|MPa)\s*$/i);
 if(unit){
  const scale={kw:1e3,kj:1e3,km:1e3,cm:1e-2,mm:1e-3,mw:1e-3,mj:1e-3,ma:1e-3,ms:1e-3,'µs':1e-6,'μs':1e-6,nm:1e-9,kpa:1e3,mpa:1e6}[unit[2].toLowerCase()];
  if(scale&&Math.abs(Number(unit[1])*scale-expected)<=tol)return true;
 }
 // A ratio and its percentage increase can both be correct: 1.6 times = 60% greater.
 const ratio=text.match(/([-+]?(?:\d+(?:\.\d*)?|\.\d+)).*?\(\s*([-+]?\d+(?:\.\d+)?)\s*%\s*(?:increase|greater|more)?\s*\)\s*$/i);
 if(ratio&&Math.abs(Number(ratio[1])-expected)<=tol&&Math.abs(Number(ratio[2])-(expected-1)*100)<.3)return true;
 // Accept simple exact mathematical forms such as 4π or π/2.
 const exact=text.replace(/\s/g,'').match(/(?:^|=)([-+]?(?:\d+(?:\.\d*)?)?)\*?(?:π|pi)(?:\/(\d+(?:\.\d+)?))?(?:[a-zA-Z]*)$/i);
 if(exact){
  const m=(exact[1]===''||exact[1]==='+')?1:exact[1]==='-'?-1:Number(exact[1]);
  const value=m*Math.PI/(exact[2]?Number(exact[2]):1);
  if(Number.isFinite(value)&&Math.abs(value-expected)<=tol)return true;
 }
 return false;
}

function nextSchedule(s,rating){const old=Math.max(.25,s.stability||0),elapsed=s.last?Math.max(0,(now()-s.last)/DAY):0,over=old?clamp(elapsed/old,0,2):0;let stability=old,difficulty=clamp(s.difficulty||5,1,10),days;if(rating==='again'){difficulty=clamp(difficulty+.7,1,10);stability=Math.max(.25,old*.35);days=10/1440}else if(rating==='hard'){difficulty=clamp(difficulty+.2,1,10);stability=Math.max(1,old?old*1.12:1);days=Math.min(stability,1)}else if(rating==='good'){difficulty=clamp(difficulty-.08,1,10);stability=s.stage<0?3:clamp(old*(1.72+.12*over-.035*(difficulty-5)),2,365);days=stability}else{difficulty=clamp(difficulty-.3,1,10);stability=s.stage<0?7:clamp(old*(2.3+.12*over-.025*(difficulty-5)),4,365);days=stability}return {stability,difficulty,days}}
function rateCard(c,rating,answer){
 const s=state(c.id),prev=s.last||0,wasNew=s.stage<0,sch=nextSchedule(s,rating);s.last=now();s.stability=sch.stability;s.difficulty=sch.difficulty;s.due=now()+sch.days*DAY;s.stage=Math.max(0,s.stage)+(rating==='good'?1:rating==='easy'?2:0);s.mastered=s.stability>=60&&(s.good||0)>=2;if(wasNew&&!s.firstSeen){s.firstSeen=dateKey();daily().newCards++}if(rating==='again')s.again++;else if(rating==='hard')s.hard++;else s.good++;s.history=s.history||[];s.history.push({t:now(),rating,answer:String(answer||'').slice(0,250),stability:s.stability});if(s.history.length>40)s.history=s.history.slice(-40);setState(c.id,s);
 const ts=topicStat(c.subject,c.revisionTopic||c.topic);ts.attempts++;ts.last=now();if(currentEvaluation?.status==='correct')ts.success++;else if(rating==='again'||rating==='hard')ts.lastMiss=now();
 if((rating==='again'||rating==='hard')&&currentEvaluation?.status!=='correct')addError({type:'card',id:c.id,subject:c.subject,topic:c.revisionTopic||c.topic,result:rating,answer:String(answer||'').slice(0,300),missing:currentEvaluation?.missing||[],longGap:prev&&((now()-prev)/DAY>30)});
 profile.reviews++;daily().reviews++;save();advanceSession();
}
function awardFlashIfCorrect(){
 if(currentFlashAwarded||currentEvaluation?.status!=='correct')return;currentFlashAwarded=true;award(1,'flash');daily().flashCorrect++;
}
function overrideFlashCorrect(){
 if(currentEvaluation?.status==='correct')return;currentEvaluation={status:'correct',score:1,text:'Marked correct by you.',missing:[]};awardFlashIfCorrect();const f=document.getElementById('feedback');f.className='feedback show correct';f.textContent='Marked correct by you. +1 point / +1 XP.';document.getElementById('overrideBtn').classList.remove('show')
}

function weightedPick(items,n,weightFn){
 const pool=[...items],out=[];while(pool.length&&out.length<n){let total=0,ws=pool.map(x=>{const w=Math.max(.05,weightFn(x));total+=w;return w});let r=Math.random()*total,idx=0;for(;idx<ws.length;idx++){r-=ws[idx];if(r<=0)break}out.push(pool.splice(Math.min(idx,pool.length-1),1)[0])}return out;
}

// Mock-only exam questions must be explicitly eligible; AS level alone is not a mock flag.
// The November Maths mock is Year 1 Pure only, so Statistics, Mechanics and
// school-excluded radian questions remain in full revision, not mock sessions.
// Exclude A-level-only composite/inverse functions from the first Year 1 Pure mock.
// Keep the original flashcards in full/taught revision and preserve review history.
const MOCK_MATHS_YEAR2_EXCLUDED_IDS=new Set(['math_function_composite','math_inverse_condition','task1_v136_063','math_inverse','v33_card_maths_functions_76','v33_card_maths_functions_77','task1_maths_006','task1_v130_156','task1_v130_157','task1_v136_064']);
function mockEligibleCard(c){
 if(c.mock!==true)return false;
 if(c.subject!=='Maths')return true;
 return c.stage==='AS'&&!['Statistics','Mechanics'].includes(c.topic)&&!MOCK_MATHS_YEAR2_EXCLUDED_IDS.has(c.id);
}
function mockEligibleQuestion(q){
 if(q.mock!==true)return false;
 if(q.subject!=='Maths')return true;
 // The first school Maths mock is Year 12 / AS Pure only; Year 13 is a later paper.
 if(q.level!=='AS')return false;
 const topic=String(q.topic||'').trim().toLowerCase();
 if(topic==='statistics'||topic==='mechanics')return false;
 return !/(?:\bradians?\b|π)/i.test(String(q.prompt||''));
}

function startMockSession(){
 const sub=document.getElementById('mockSubject').value,mode=document.getElementById('mockMode').value,count=Number(document.getElementById('mockCount').value);
 const cardPool=cards.filter(c=>c.active!==false&&c.subject===sub&&mockEligibleCard(c));
 const qAll=subjectExam(sub).filter(mockEligibleQuestion);
 const groups=new Map();for(const q of qAll){if(!groups.has(q.groupId))groups.set(q.groupId,[]);groups.get(q.groupId).push(q)}
 for(const g of groups.values())g.sort((x,y)=>String(x.groupOrder).localeCompare(String(y.groupOrder),undefined,{numeric:true}));
 const items=[];
 if(mode!=='exam'){
   const want=mode==='flash'?count:Math.max(1,Math.ceil(count*.6));
   const picked=weightedPick(cardPool,Math.min(want,cardPool.length),c=>1+weakness(c)/5+(isDue(c)?4:0)+(1-memoryHealth(c))*3);
   picked.forEach(c=>items.push({type:'card',id:c.id}));
 }
 if(mode!=='flash'){
   const target=Math.max(1,count-items.length),pickedGroups=weightedPick([...groups.values()],Math.min(target,groups.size),g=>1+groupWeakness(g));
   for(const g of pickedGroups){for(const q of g){items.push({type:'exam',id:q.id,groupId:q.groupId})}}
 }
 if(!items.length){showToast('No mock material is available for that selection yet');return}
 if(mode==='mixed'){
   const blocks=[],seenGroups=new Set();
   for(const item of items){
     if(item.type==='exam'&&item.groupId){
       if(seenGroups.has(item.groupId))continue;
       seenGroups.add(item.groupId);
       blocks.push(items.filter(x=>x.type==='exam'&&x.groupId===item.groupId));
     }else blocks.push([item]);
   }
   blocks.sort(()=>Math.random()-.5);
   items.splice(0,items.length,...blocks.flat());
 }
 activeSession={kind:'mock',items,index:0,title:sub+' mock revision'};currentCardId=null;renderAll();
}
function flashEligible(c){return flashScopeFilter==='mock'?mockEligibleCard(c):flashScopeFilter==='taught'?taughtCard(c):true}
function selectedFlashCards(){const sub=document.getElementById('flashSubject').value,base=subjectCards(sub);return base.filter(c=>flashTopics.has(flashTopicLabel(c))&&flashEligible(c))}
function startFlashSession(){
 const count=Number(document.getElementById('flashCount').value),pool=selectedFlashCards();if(!pool.length){showToast('Pick at least one topic');return}
 const picked=weightedPick(pool,Math.min(count,pool.length),c=>1+weakness(c)/6+(isDue(c)?4:0)+(isNew(c)?1:0));
 activeSession={kind:'flash',items:picked.map(c=>({type:'card',id:c.id})),index:0,title:'Random flashcards'};currentCardId=null;renderAll();
}
function examGroups(){
 const sub=document.getElementById('examSubject').value,level=document.getElementById('examLevel').value;
 const difficulty=document.getElementById('examDifficulty')?.value||'all';
 const all=subjectExam(sub).filter(q=>level==='both'||q.level===level);
 if(!examYears.size||!examTopics.size||!examTypes.size)return [];
 // Select a group by eligible member, then retain every linked part.
 // Parts dependent on an earlier part are never silently separated.
 const matched=all.filter(q=>examYears.has(q.year)&&examTopics.has(examTopicLabel(q))&&examTypes.has(q.questionType)&&
  (difficulty==='all'||(difficulty==='stretch'&&q.marks>=5)||(difficulty==='quick'&&q.marks<=3)));
 const eligible=new Set(matched.map(q=>q.groupId)),map=new Map();
 for(const q of all){
  if(!eligible.has(q.groupId)||!examYears.has(q.year))continue;
  if(!map.has(q.groupId))map.set(q.groupId,[]);
  map.get(q.groupId).push(q);
 }
 for(const arr of map.values())arr.sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));
 return [...map.values()];
}
function groupWeakness(group){let s=0;for(const q of group){const t=profile.topicWeakness[topicKey(q.subject,q.revisionTopic||q.topic)]||0,last=profile.examResults[q.id]?.last,acc=last?last.marks/last.max:0;s+=1+t*2+(1-acc)*4+(profile.errorLog.some(e=>e.type==='exam'&&e.id===q.id)?4:0)}return s/group.length}
function startExamSession(){
 const groups=examGroups(),count=Number(document.getElementById('examCount').value);if(!groups.length){showToast('No questions match those filters');return}
 let chosen;if(document.getElementById('examOrder').value==='random')chosen=[...groups].sort(()=>Math.random()-.5).slice(0,count);else chosen=weightedPick(groups,Math.min(count,groups.length),g=>1+groupWeakness(g));
 const items=[];for(const g of chosen)for(const q of g)items.push({type:'exam',id:q.id,groupId:q.groupId});
 activeSession={kind:'exam',items,index:0,title:(document.getElementById('examDifficulty')?.value==='stretch'?'Extended exam-style problems':document.getElementById('examDifficulty')?.value==='quick'?'Quick exam practice':'Mixed exam practice')};renderAll();
}
function awardExam(q,marks,answer,missedPoints){
 const ts=topicStat(q.subject,q.revisionTopic||q.topic);ts.examMarks+=marks;ts.examMax+=q.marks;ts.attempts++;ts.last=now();if(marks<q.marks)ts.lastMiss=now();
 if(!profile.examResults[q.id])profile.examResults[q.id]={attempts:[]};const rec={marks,max:q.marks,date:now(),answer:String(answer||'').slice(0,1000),missedPoints,scannedPages:window.RevisionScan?.countFor(q.id)||0,markingRoute:currentExamMarkingRoute==='manual'?'self-reviewed':'local-suggestion-reviewed'};profile.examResults[q.id].attempts.push(rec);profile.examResults[q.id].last=rec;
 let w=profile.topicWeakness[topicKey(q.subject,q.revisionTopic||q.topic)]||0;if(marks/q.marks<.5)w=Math.min(10,w+2);else if(marks<q.marks)w=Math.min(10,w+1);else w=Math.max(0,w-1);profile.topicWeakness[topicKey(q.subject,q.revisionTopic||q.topic)]=w;
 if(marks<q.marks)addError({type:'exam',id:q.id,subject:q.subject,topic:q.revisionTopic||q.topic,result:marks+'/'+q.marks,answer:String(answer||'').slice(0,1000),missedPoints});
 window.RevisionScan?.commit(q.id);
 award(marks,'exam');save();advanceSession();
}

function challengeCards(sub,scope){let a=cards.filter(c=>c.active!==false&&(!sub||c.subject===sub));return scope==='mock'?a.filter(mockEligibleCard):a.filter(taughtCard)}
function challengeQuestions(sub,scope){let q=examQuestions.filter(x=>x.standalone!==false&&(!sub||x.subject===sub));if(scope==='mock')q=q.filter(mockEligibleQuestion);return q}
function makeChallenge(sub,scope){
 const key=dateKey()+'|'+(sub||'All')+'|'+scope;if(profile.dailyChallenges[key])return {key,...profile.dailyChallenges[key]};
 const cpool=challengeCards(sub,scope),weak=[...cpool].sort((a,b)=>weakness(b)-weakness(a)),items=[],used=new Set();
 for(const c of weak){if(items.length>=3)break;const ct=c.courseTopic||c.topic;if(!used.has(ct)){items.push({type:'card',id:c.id});used.add(ct)}}
 const old=[...cpool].filter(c=>state(c.id).stage>=0&&!items.some(i=>i.id===c.id)).sort((a,b)=>(state(a.id).last||0)-(state(b.id).last||0));if(old[0])items.push({type:'card',id:old[0].id});
 const random=[...cpool].filter(c=>!items.some(i=>i.id===c.id)).sort(()=>Math.random()-.5);if(random[0])items.push({type:'card',id:random[0].id});
 const qgroups=new Map();for(const q of challengeQuestions(sub,scope)){if(!qgroups.has(q.groupId))qgroups.set(q.groupId,[]);qgroups.get(q.groupId).push(q)}
 const chosen=weightedPick([...qgroups.values()],2,g=>1+groupWeakness(g));for(const g of chosen){g.sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));for(const q of g)items.push({type:'exam',id:q.id,groupId:q.groupId})}
 const s={items,index:0,done:false,subject:sub||'',scope};profile.dailyChallenges[key]=s;save();return {key,...s};
}
function startChallenge(){const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,s=makeChallenge(sub,scope);const stored=profile.dailyChallenges[s.key];if(stored.done)stored.index=0;activeSession={kind:'daily',key:s.key,...stored,title:'Daily starter'};switchPanel('study');renderAll()}
function startMistakes(){
 const items=[],seen=new Set();
 for(const e of profile.errorLog){
   if(items.length>=15)break;
   if(e.type==='exam'){
     const q=examQuestions.find(x=>x.id===e.id);if(!q)continue;
     const k='examgroup|'+q.groupId;if(seen.has(k))continue;seen.add(k);
     const group=examQuestions.filter(x=>x.groupId===q.groupId).sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));
     for(const part of group){if(items.length>=15)break;items.push({type:'exam',id:part.id,groupId:part.groupId})}
   }else{
     const k='card|'+e.id;if(seen.has(k))continue;seen.add(k);items.push({type:'card',id:e.id});
   }
 }
 if(!items.length){showToast('No mistakes recorded yet');return}
 activeSession={kind:'mistakes',items,index:0,title:'Mistake bank'};switchPanel('study');renderAll();
}
function advanceSession(){
 currentCardId=null;currentEvaluation=null;currentFlashAwarded=false;currentExamScore=0;
 if(!activeSession){renderAll();return}activeSession.index++;
 if(activeSession.kind==='daily'){const s=profile.dailyChallenges[activeSession.key];s.index=activeSession.index;if(activeSession.index>=activeSession.items.length){s.done=true;const today=dateKey(),y=previousCalendarDate();if(profile.lastChallengeDate!==today){
  profile.challengeStreak=profile.lastChallengeDate===y?profile.challengeStreak+1:1;
  profile.lastChallengeDate=today;
  if(profile.challengeBonusDate!==today){
    const bonus=challengeBonusForStreak(profile.challengeStreak);
    profile.challengeBonusDate=today;
    // Streak adds spendable points only; daily challenge completions award no XP.
    // The date guards above prevent a repeat streak bonus on the same day.
    if(bonus)profile.points+=bonus;
    showToast('Daily challenge complete · '+profile.challengeStreak+'-day streak'+(bonus?' · +'+bonus+' bonus point'+(bonus===1?'':'s'):''));
  }
 }activeSession=null}else activeSession={...activeSession,index:s.index};save()}
 else if(activeSession.index>=activeSession.items.length)activeSession={...activeSession,done:true};
 renderAll();
}

function diagram(t){
 const S='<svg viewBox="0 0 360 170" aria-hidden="true">';
 if(t==='resolve')return S+'<line x1="55" y1="135" x2="275" y2="50" stroke="#2563eb" stroke-width="5"/><line x1="55" y1="135" x2="275" y2="135" stroke="#94a3b8" stroke-width="3"/><line x1="275" y1="135" x2="275" y2="50" stroke="#94a3b8" stroke-width="3"/><text x="112" y="119" font-size="17">θ</text><text x="145" y="158" font-size="14">adjacent → cos</text><text x="280" y="96" font-size="14">opposite → sin</text></svg>';
 if(t==='slope')return S+'<polygon points="40,145 310,145 310,55" fill="#e2e8f0"/><rect x="185" y="79" width="56" height="34" rx="5" transform="rotate(-18 213 96)" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><line x1="213" y1="96" x2="213" y2="154" stroke="#0f172a" stroke-width="3"/><text x="220" y="151" font-size="14">mg</text><line x1="213" y1="96" x2="155" y2="115" stroke="#b45309" stroke-width="4"/><text x="75" y="112" font-size="13">mg sin θ</text><line x1="213" y1="96" x2="233" y2="42" stroke="#15803d" stroke-width="4"/><text x="239" y="43" font-size="14">R</text><text x="241" y="124" font-size="13">mg cos θ</text></svg>';
 if(t==='couple')return S+'<rect x="78" y="66" width="204" height="44" rx="8" fill="#f1f5f9" stroke="#64748b"/><line x1="112" y1="140" x2="112" y2="38" stroke="#2563eb" stroke-width="5"/><line x1="248" y1="35" x2="248" y2="138" stroke="#2563eb" stroke-width="5"/><line x1="112" y1="22" x2="248" y2="22" stroke="#0f172a"/><text x="177" y="16" font-size="15">d</text><text x="127" y="94" font-size="16">moment = Fd</text></svg>';
 if(t==='displacement-time')return S+'<line x1="48" y1="140" x2="320" y2="140" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="140" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 128 C105 123 130 102 165 76 S238 42 308 36" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="150" y1="94" x2="235" y2="48" stroke="#b45309" stroke-width="2" stroke-dasharray="6 5"/><text x="118" y="158" font-size="13">gradient = velocity</text></svg>';
 if(t==='velocity-time')return S+'<line x1="48" y1="88" x2="320" y2="88" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 128 L135 42 L220 42 L308 108" fill="none" stroke="#2563eb" stroke-width="5"/><text x="95" y="160" font-size="13">gradient = a • area = displacement</text></svg>';
 if(t==='acceleration-time')return S+'<line x1="48" y1="92" x2="320" y2="92" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 50 L145 50 L145 123 L230 123 L230 68 L308 68" fill="none" stroke="#2563eb" stroke-width="5"/><text x="128" y="158" font-size="13">signed area = Δv</text></svg>';
 if(t==='projectile')return S+'<path d="M48 130 Q178 18 315 130" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="48" y1="130" x2="310" y2="130" stroke="#94a3b8" stroke-width="2"/><text x="54" y="60" font-size="13">vertical a = −g</text><text x="175" y="148" font-size="13">horizontal v constant</text></svg>';
 if(t==='moment')return S+'<line x1="48" y1="105" x2="318" y2="105" stroke="#64748b" stroke-width="7"/><polygon points="175,105 160,135 190,135" fill="#0f172a"/><line x1="270" y1="36" x2="270" y2="105" stroke="#2563eb" stroke-width="5"/><line x1="175" y1="45" x2="270" y2="45" stroke="#b45309" stroke-width="2" stroke-dasharray="5 4"/><text x="207" y="38" font-size="14">d⊥</text><text x="256" y="28" font-size="14">F</text></svg>';
 if(t==='internal-resistance')return S+'<line x1="48" y1="132" x2="320" y2="132" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="25" stroke="#0f172a" stroke-width="2"/><line x1="67" y1="43" x2="300" y2="121" stroke="#2563eb" stroke-width="5"/><text x="75" y="35" font-size="14">intercept = ε</text><text x="155" y="90" font-size="14">gradient = −r</text></svg>';
 if(t==='photoelectric')return S+'<rect x="176" y="86" width="125" height="38" rx="5" fill="#94a3b8"/><line x1="67" y1="45" x2="177" y2="95" stroke="#f59e0b" stroke-width="5"/><circle cx="201" cy="102" r="7" fill="#2563eb"/><path d="M205 98 Q238 62 281 48" fill="none" stroke="#2563eb" stroke-width="4"/><text x="50" y="35" font-size="14">photon E = hf</text><text x="222" y="42" font-size="14">hf ≥ φ</text></svg>';
 if(t==='stationary')return S+'<line x1="40" y1="90" x2="320" y2="90" stroke="#64748b" stroke-width="2"/><path d="M45 90 Q80 32 115 90 T185 90 T255 90 T315 90" fill="none" stroke="#2563eb" stroke-width="5"/><circle cx="45" cy="90" r="4"/><circle cx="115" cy="90" r="4"/><circle cx="185" cy="90" r="4"/><text x="130" y="150" font-size="14">node spacing = λ/2</text></svg>';
 if(t==='young')return S+'<line x1="55" y1="46" x2="305" y2="46" stroke="#0f172a" stroke-width="4"/><line x1="82" y1="46" x2="82" y2="144" stroke="#2563eb" stroke-width="3"/><line x1="278" y1="46" x2="278" y2="144" stroke="#2563eb" stroke-width="3"/><circle cx="278" cy="145" r="12" fill="#64748b"/><text x="112" y="121" font-size="14">E = FL/(AΔL)</text></svg>';
 if(t==='back-titration')return S+'<rect x="80" y="39" width="34" height="95" fill="#dbeafe" stroke="#2563eb"/><path d="M190 138 L270 138 L252 96 L208 96 Z" fill="#fef3c7" stroke="#64748b"/><text x="118" y="159" font-size="13">initial − leftover = reacted</text></svg>';
 if(t==='arrhenius')return S+'<line x1="52" y1="138" x2="318" y2="138" stroke="#0f172a" stroke-width="2"/><line x1="52" y1="138" x2="52" y2="25" stroke="#0f172a" stroke-width="2"/><line x1="72" y1="48" x2="296" y2="126" stroke="#2563eb" stroke-width="5"/><text x="98" y="52" font-size="14">gradient = −Ea/R</text><text x="25" y="25" font-size="13">ln k</text><text x="292" y="157" font-size="13">1/T</text></svg>';
 if(t==='circular')return S+'<circle cx="180" cy="88" r="58" fill="none" stroke="#cbd5e1" stroke-width="3"/><circle cx="238" cy="88" r="7" fill="#2563eb"/><line x1="238" y1="88" x2="183" y2="88" stroke="#b91c1c" stroke-width="4"/><line x1="238" y1="88" x2="238" y2="36" stroke="#15803d" stroke-width="4"/><text x="190" y="80" font-size="13">a, F inward</text><text x="246" y="50" font-size="13">v tangent</text></svg>';
 if(t==='shm')return S+'<line x1="45" y1="92" x2="315" y2="92" stroke="#94a3b8" stroke-width="2"/><path d="M48 92 C82 30 115 30 148 92 S215 154 248 92 S282 30 315 92" fill="none" stroke="#2563eb" stroke-width="5"/><text x="112" y="162" font-size="14">a = −ω²x</text></svg>';

 if(t==='fibre')return S+'<rect x="45" y="56" width="270" height="58" rx="28" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><path d="M55 96 L105 72 L155 98 L205 72 L255 98 L305 72" fill="none" stroke="#f59e0b" stroke-width="4"/><text x="95" y="145" font-size="13">total internal reflection</text></svg>';
 if(t==='circle')return S+'<circle cx="180" cy="88" r="62" fill="none" stroke="#2563eb" stroke-width="4"/><circle cx="180" cy="88" r="4" fill="#0f172a"/><line x1="180" y1="88" x2="235" y2="58" stroke="#94a3b8" stroke-width="3"/><text x="205" y="76" font-size="14">r</text><line x1="58" y1="138" x2="310" y2="138" stroke="#0f172a" stroke-width="2"/></svg>';
 if(t==='titration')return S+'<rect x="82" y="24" width="20" height="91" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><line x1="92" y1="115" x2="92" y2="137" stroke="#0f172a" stroke-width="2"/><path d="M185 140 L265 140 L248 96 L202 96 Z" fill="#fef3c7" stroke="#64748b" stroke-width="2"/><path d="M92 137 Q92 148 103 148" fill="none" stroke="#2563eb" stroke-width="2"/><text x="55" y="20" font-size="12">burette</text><text x="198" y="160" font-size="12">conical flask</text></svg>';
 if(t==='medical')return S+'<circle cx="180" cy="84" r="45" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/><path d="M90 84 H270" stroke="#64748b" stroke-width="2"/><path d="M180 39 V129" stroke="#64748b" stroke-width="2"/><path d="M55 84 Q90 40 125 84 Q90 128 55 84Z" fill="#dbeafe" stroke="#2563eb"/><text x="210" y="150" font-size="13">medical imaging</text></svg>';

 if(t==='energy-levels')return S+'<line x1="70" y1="130" x2="290" y2="130" stroke="#64748b" stroke-width="3"/><line x1="90" y1="92" x2="270" y2="92" stroke="#64748b" stroke-width="3"/><line x1="115" y1="52" x2="245" y2="52" stroke="#64748b" stroke-width="3"/><path d="M150 124 V61" stroke="#2563eb" stroke-width="4"/><polygon points="150,52 144,64 156,64" fill="#2563eb"/><path d="M210 58 V121" stroke="#f59e0b" stroke-width="4"/><polygon points="210,130 204,118 216,118" fill="#f59e0b"/><text x="56" y="145" font-size="12">lower E</text><text x="242" y="44" font-size="12">higher E</text></svg>';
 if(t==='gas-particles')return S+'<rect x="55" y="35" width="250" height="100" rx="8" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>'+[[85,60],[125,95],[160,55],[205,80],[260,58],[278,112],[95,120],[215,118]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#2563eb"/>').join('')+'<path d="M86 60 l18 -8 M162 55 l15 12 M206 80 l22 -9" stroke="#b45309" stroke-width="2"/><text x="102" y="155" font-size="13">random molecular motion → pressure</text></svg>';
 if(t==='grating')return S+'<line x1="96" y1="30" x2="96" y2="140" stroke="#0f172a" stroke-width="4"/><line x1="104" y1="30" x2="104" y2="140" stroke="#0f172a" stroke-width="1"/><line x1="112" y1="30" x2="112" y2="140" stroke="#0f172a" stroke-width="1"/><line x1="30" y1="85" x2="95" y2="85" stroke="#2563eb" stroke-width="4"/><path d="M113 85 L295 42 M113 85 L295 85 M113 85 L295 128" stroke="#f59e0b" stroke-width="3"/><text x="190" y="25" font-size="13">d sin θ = nλ</text></svg>';
 if(t==='refraction')return S+'<line x1="40" y1="85" x2="320" y2="85" stroke="#64748b" stroke-width="2"/><line x1="180" y1="25" x2="180" y2="145" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 5"/><path d="M105 30 L180 85 L228 145" fill="none" stroke="#2563eb" stroke-width="4"/><text x="78" y="74" font-size="13">i</text><text x="194" y="108" font-size="13">r</text></svg>';
 if(t==='force-time')return S+'<line x1="55" y1="135" x2="310" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="55" y1="135" x2="55" y2="25" stroke="#0f172a" stroke-width="2"/><path d="M58 135 L118 52 L210 52 L280 135 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="4"/><text x="115" y="155" font-size="13">area = impulse = Δp</text></svg>';
 if(t==='divider')return S+'<line x1="65" y1="48" x2="295" y2="48" stroke="#0f172a" stroke-width="2"/><line x1="65" y1="48" x2="65" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="295" y1="48" x2="295" y2="135" stroke="#0f172a" stroke-width="2"/><polyline points="110,48 120,58 130,38 140,58 150,38 160,58 170,48" fill="none" stroke="#2563eb" stroke-width="3"/><polyline points="190,48 200,58 210,38 220,58 230,38 240,58 250,48" fill="none" stroke="#b45309" stroke-width="3"/><line x1="180" y1="48" x2="180" y2="120" stroke="#64748b" stroke-width="2"/><text x="92" y="83" font-size="12">R₁</text><text x="226" y="83" font-size="12">R₂</text><text x="160" y="140" font-size="12">Vout</text></svg>';
 if(t==='wire')return S+'<line x1="55" y1="85" x2="305" y2="85" stroke="#b45309" stroke-width="8"/><line x1="55" y1="112" x2="305" y2="112" stroke="#64748b" stroke-width="1"/><line x1="55" y1="105" x2="55" y2="120" stroke="#64748b"/><line x1="305" y1="105" x2="305" y2="120" stroke="#64748b"/><text x="169" y="133" font-size="13">L</text><text x="97" y="58" font-size="13">ρ = RA/L</text></svg>';
 if(t==='field-lines')return S+'<circle cx="180" cy="85" r="16" fill="#2563eb"/>'+[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180,x1=180+24*Math.cos(r),y1=85+24*Math.sin(r),x2=180+72*Math.cos(r),y2=85+72*Math.sin(r);return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#64748b" stroke-width="2"/>'}).join('')+'<text x="132" y="164" font-size="13">radial field</text></svg>';
 if(t==='capacitor')return S+'<line x1="50" y1="85" x2="145" y2="85" stroke="#0f172a" stroke-width="3"/><line x1="145" y1="45" x2="145" y2="125" stroke="#2563eb" stroke-width="6"/><line x1="165" y1="45" x2="165" y2="125" stroke="#2563eb" stroke-width="6"/><line x1="165" y1="85" x2="310" y2="85" stroke="#0f172a" stroke-width="3"/><text x="120" y="151" font-size="13">C = Q/V</text></svg>';
 if(t==='magnetic')return S+'<line x1="180" y1="30" x2="180" y2="140" stroke="#b45309" stroke-width="6"/><circle cx="180" cy="85" r="35" fill="none" stroke="#2563eb" stroke-width="2"/><circle cx="180" cy="85" r="62" fill="none" stroke="#2563eb" stroke-width="2"/><text x="214" y="45" font-size="13">B field around current</text></svg>';
 if(t==='induction')return S+'<rect x="52" y="64" width="72" height="42" rx="5" fill="#fee2e2" stroke="#b91c1c"/><text x="73" y="90" font-size="16">N S</text><path d="M150 48 q25 18 0 36 q25 18 0 36 q25 18 0 36" fill="none" stroke="#2563eb" stroke-width="5"/><path d="M120 85 H146" stroke="#0f172a" stroke-width="3"/><polygon points="146,85 136,79 136,91" fill="#0f172a"/><text x="215" y="90" font-size="13">change in flux → emf</text></svg>';
 if(t==='decay')return S+'<line x1="55" y1="135" x2="310" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="55" y1="135" x2="55" y2="25" stroke="#0f172a" stroke-width="2"/><path d="M58 36 C105 68 148 94 205 111 C245 122 275 128 307 131" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="55" y1="84" x2="300" y2="84" stroke="#94a3b8" stroke-dasharray="5 5"/><text x="220" y="76" font-size="12">half-life</text></svg>';
 if(t==='quark')return S+'<circle cx="130" cy="85" r="38" fill="#dbeafe" stroke="#2563eb"/><circle cx="115" cy="75" r="10" fill="#dc2626"/><circle cx="145" cy="75" r="10" fill="#dc2626"/><circle cx="130" cy="102" r="10" fill="#16a34a"/><text x="111" y="79" font-size="10" fill="#fff">u</text><text x="141" y="79" font-size="10" fill="#fff">u</text><text x="126" y="106" font-size="10" fill="#fff">d</text><text x="190" y="90" font-size="13">example baryon</text></svg>';
 if(t==='molecule-shape')return S+'<circle cx="180" cy="85" r="14" fill="#2563eb"/><circle cx="105" cy="55" r="11" fill="#94a3b8"/><circle cx="255" cy="55" r="11" fill="#94a3b8"/><circle cx="180" cy="145" r="11" fill="#94a3b8"/><line x1="168" y1="78" x2="116" y2="59" stroke="#0f172a" stroke-width="3"/><line x1="192" y1="78" x2="244" y2="59" stroke="#0f172a" stroke-width="3"/><line x1="180" y1="99" x2="180" y2="134" stroke="#0f172a" stroke-width="3"/><text x="138" y="25" font-size="13">electron pairs repel</text></svg>';
 if(t==='hess')return S+'<rect x="48" y="30" width="75" height="30" rx="5" fill="#dbeafe"/><rect x="238" y="30" width="75" height="30" rx="5" fill="#dcfce7"/><rect x="142" y="118" width="78" height="30" rx="5" fill="#fef3c7"/><path d="M123 45 H236" stroke="#2563eb" stroke-width="3"/><path d="M90 61 L153 118 M275 61 L208 118" stroke="#64748b" stroke-width="3"/><text x="144" y="82" font-size="13">Hess cycle</text></svg>';
 if(t==='born-haber')return S+'<line x1="65" y1="140" x2="285" y2="140" stroke="#64748b" stroke-width="3"/><line x1="85" y1="110" x2="270" y2="110" stroke="#64748b" stroke-width="3"/><line x1="105" y1="78" x2="255" y2="78" stroke="#64748b" stroke-width="3"/><line x1="125" y1="45" x2="240" y2="45" stroke="#64748b" stroke-width="3"/><path d="M70 137 L88 113 L108 81 L128 48" fill="none" stroke="#2563eb" stroke-width="3"/><text x="188" y="164" font-size="12">enthalpy levels</text></svg>';
 if(t==='nmr')return S+'<line x1="45" y1="135" x2="315" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="80" y1="135" x2="80" y2="78" stroke="#2563eb" stroke-width="4"/><line x1="145" y1="135" x2="145" y2="45" stroke="#2563eb" stroke-width="4"/><line x1="225" y1="135" x2="225" y2="92" stroke="#2563eb" stroke-width="4"/><line x1="292" y1="135" x2="292" y2="115" stroke="#2563eb" stroke-width="4"/><text x="205" y="158" font-size="12">chemical shift δ / ppm</text></svg>';
 if(t==='chromatography')return S+'<rect x="115" y="25" width="130" height="120" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><line x1="125" y1="126" x2="235" y2="126" stroke="#0f172a" stroke-width="2"/><line x1="125" y1="46" x2="235" y2="46" stroke="#2563eb" stroke-width="2" stroke-dasharray="4 4"/><circle cx="160" cy="82" r="7" fill="#dc2626"/><circle cx="202" cy="64" r="7" fill="#16a34a"/><text x="145" y="163" font-size="12">Rf = solute / solvent</text></svg>';
 if(t==='organic-reaction')return S+'<rect x="42" y="60" width="95" height="48" rx="8" fill="#dbeafe"/><text x="70" y="90" font-size="13">reactant</text><path d="M145 84 H218" stroke="#0f172a" stroke-width="3"/><polygon points="218,84 207,78 207,90" fill="#0f172a"/><text x="155" y="68" font-size="11">reagent / conditions</text><rect x="225" y="60" width="95" height="48" rx="8" fill="#dcfce7"/><text x="252" y="90" font-size="13">product</text></svg>';
 if(t==='unit-circle')return S+'<circle cx="180" cy="85" r="62" fill="none" stroke="#2563eb" stroke-width="3"/><line x1="80" y1="85" x2="280" y2="85" stroke="#64748b"/><line x1="180" y1="15" x2="180" y2="155" stroke="#64748b"/><line x1="180" y1="85" x2="230" y2="48" stroke="#b45309" stroke-width="3"/><text x="199" y="78" font-size="13">θ</text></svg>';
 if(t==='tangent')return S+'<line x1="45" y1="138" x2="315" y2="138" stroke="#0f172a"/><line x1="75" y1="150" x2="75" y2="25" stroke="#0f172a"/><path d="M82 125 Q165 20 295 112" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="115" y1="100" x2="255" y2="46" stroke="#b45309" stroke-width="3"/><text x="187" y="40" font-size="12">gradient = dy/dx</text></svg>';
 if(t==='area-curve')return S+'<line x1="45" y1="135" x2="315" y2="135" stroke="#0f172a"/><line x1="70" y1="150" x2="70" y2="30" stroke="#0f172a"/><path d="M75 125 Q145 35 250 70 Q285 83 305 110" fill="none" stroke="#2563eb" stroke-width="4"/><path d="M105 117 Q155 48 225 65 L225 135 L105 135 Z" fill="#dbeafe" opacity=".8"/><text x="137" y="158" font-size="12">∫ f(x) dx</text></svg>';
 if(t==='vector')return S+'<line x1="70" y1="130" x2="265" y2="55" stroke="#2563eb" stroke-width="4"/><polygon points="265,55 249,54 256,67" fill="#2563eb"/><line x1="70" y1="130" x2="265" y2="130" stroke="#94a3b8" stroke-width="2"/><line x1="265" y1="130" x2="265" y2="55" stroke="#94a3b8" stroke-width="2"/><text x="148" y="151" font-size="12">components</text></svg>';
 if(t==='newton')return S+'<rect x="142" y="62" width="76" height="48" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><line x1="142" y1="86" x2="72" y2="86" stroke="#b45309" stroke-width="4"/><polygon points="72,86 86,79 86,93" fill="#b45309"/><line x1="218" y1="86" x2="292" y2="86" stroke="#16a34a" stroke-width="4"/><polygon points="292,86 278,79 278,93" fill="#16a34a"/><line x1="180" y1="62" x2="180" y2="28" stroke="#64748b" stroke-width="4"/><polygon points="180,28 173,42 187,42" fill="#64748b"/><line x1="180" y1="110" x2="180" y2="148" stroke="#dc2626" stroke-width="4"/><polygon points="180,148 173,134 187,134" fill="#dc2626"/><text x="122" y="165" font-size="13">label forces on the object</text></svg>';
 if(t==='work-angle')return S+'<line x1="64" y1="132" x2="310" y2="132" stroke="#64748b" stroke-width="3"/><line x1="92" y1="122" x2="250" y2="50" stroke="#2563eb" stroke-width="5"/><polygon points="250,50 234,51 241,64" fill="#2563eb"/><path d="M125 132 A48 48 0 0 1 164 103" fill="none" stroke="#b45309" stroke-width="2"/><text x="142" y="122" font-size="16">θ</text><text x="111" y="160" font-size="13">W = Fs cos θ</text></svg>';
 if(t.startsWith('particle-'))return particleDiagram(t);
 return '';
}


function particleDiagram(t){
 // First-party self-contained, authored SVG diagrams for AQA 7408 particle-interaction revision.
 // Time flows left-to-right in exchange diagrams. They are schematics, not to scale.
 const P=(d,color='#2563eb',width=2.5)=>'<path d="'+d+'" stroke="'+color+'" stroke-width="'+width+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
 const X=(x,y,label,color='#0f172a',size=12)=>'<text x="'+x+'" y="'+y+'" font-family="Arial,sans-serif" fill="'+color+'" font-size="'+size+'">'+label+'</text>';
 const V=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="3.8" fill="#0f172a"/>';
 const W=(x1,y1,x2,y2,color='#e49b26')=>{
  const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),px=-dy/len,py=dx/len;
  const pts=Array.from({length:33},(_,i)=>{const u=i/32,offset=5*Math.sin(u*Math.PI*12);return (x1+dx*u+px*offset).toFixed(1)+','+(y1+dy*u+py*offset).toFixed(1)}).join(' ');
  return '<polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="2.7" stroke-linecap="round"/>';
 };
 const frame=(label,body)=>'<svg viewBox="0 0 360 190" role="img" aria-label="'+label+'">'+
 '<rect x="2" y="2" width="356" height="186" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>'+body+X(23,178,'Time →','#64748b',11)+'</svg>';
 if(t==='particle-beta-minus'){
  const b=P('M24 80 L112 80')+P('M112 80 L300 39')+W(112,80,228,115)+
   P('M228 115 L321 89')+P('M228 115 L321 148')+V(112,80)+V(228,115)+
   X(26,70,'d')+X(294,31,'u')+X(144,102,'W⁻','#b45309')+X(320,80,'e⁻')+X(292,164,'anti-νₑ');
  return frame('Beta-minus quark interaction: d becomes u and emits W minus, then W minus becomes electron and electron antineutrino',b);
 }
 if(t==='particle-beta-plus'){
  const b=P('M24 80 L112 80')+P('M112 80 L300 39')+W(112,80,228,115)+
   P('M228 115 L321 89')+P('M228 115 L321 148')+V(112,80)+V(228,115)+
   X(26,70,'u')+X(294,31,'d')+X(144,102,'W⁺','#b45309')+X(320,80,'e⁺')+X(301,164,'νₑ');
  return frame('Beta-plus quark interaction: u becomes d and emits W plus, then W plus becomes positron and electron neutrino',b);
 }
 if(t==='particle-electron-capture'){
  const b=P('M25 49 L132 53')+P('M132 53 L314 44')+P('M25 134 L228 130')+
   P('M228 130 L315 140')+W(132,53,228,130)+V(132,53)+V(228,130)+
   X(28,38,'e⁻')+X(296,32,'νₑ')+X(28,126,'u')+X(304,157,'d')+X(177,90,'W⁻','#b45309');
  return frame('Electron capture: incoming electron and up quark exchange W minus, producing electron neutrino and down quark',b);
 }
 if(t==='particle-virtual-photon'){
  const b=P('M25 46 L107 70')+P('M107 70 L317 42')+P('M25 139 L246 119')+
   P('M246 119 L316 142')+W(107,70,246,119,'#a855f7')+V(107,70)+V(246,119)+
   X(28,34,'e⁻')+X(301,30,'e⁻')+X(28,156,'e⁻')+X(311,163,'e⁻')+
   X(136,82,'virtual γ','#7c3aed')+X(65,177,'Electromagnetic interaction','#64748b',11);
  return frame('Two charged particles interacting by exchanging a virtual photon',b);
 }
 if(t==='particle-pion-exchange'){
  const b=P('M25 45 L111 60')+P('M111 60 L314 39')+P('M25 143 L246 129')+
   P('M246 129 L316 150')+W(111,60,246,129)+V(111,60)+V(246,129)+
   X(28,34,'p')+X(304,28,'n')+X(28,159,'n')+X(308,168,'p')+
   X(157,90,'π⁺','#b45309')+X(62,178,'Residual strong interaction','#64748b',11);
  return frame('Pion exchange between nucleons: proton changes to neutron emitting a virtual positive pion, neutron absorbs it to become proton',b);
 }
 if(t==='particle-annihilation'){
  const b=P('M60 28 L171 93')+P('M60 159 L171 93')+V(171,93)+
   W(171,93,282,31,'#e49b26')+W(171,93,60,155,'#e49b26')+
   X(43,25,'e⁻')+X(43,174,'e⁺')+X(287,33,'γ')+X(42,145,'γ')+
   X(199,157,'Process schematic','#64748b',11);
  return frame('Electron positron annihilation into two opposite-direction gamma photons; process sketch, not Feynman diagram',b);
 }
 if(t==='particle-pair-production'){
  const b=W(26,77,152,91)+P('M152 91 L296 38')+P('M152 91 L296 137')+V(152,91)+
   '<circle cx="154" cy="151" r="11" fill="#dbeafe" stroke="#64748b"/>'+
   X(18,58,'γ')+X(300,35,'e⁻')+X(300,153,'e⁺')+X(172,170,'Nearby nucleus','#64748b',11)+
   P('M155 140 L155 103','#94a3b8',1.3);
  return frame('Pair production: gamma photon creates electron and positron near a nucleus to conserve momentum; process schematic',b);
 }
 if(t==='particle-diffraction'){
  let circles='';
  for(const r of [15,31,46])circles+='<circle cx="264" cy="88" r="'+r+'" fill="none" stroke="#38bdf8" stroke-width="3"/>';
  const b=P('M24 88 L121 88')+P('M137 88 L207 88','#94a3b8',1.8)+
  '<rect x="119" y="54" width="8" height="68" rx="3" fill="#64748b"/>'+circles+
  X(26,74,'e⁻ beam')+X(96,43,'Crystal')+X(229,159,'Diffraction rings','#64748b',11);
  return frame('Electron beam passes through thin crystal and produces concentric diffraction rings',b);
 }
 if(t==='particle-lines'){
  let b='<rect x="25" y="31" width="310" height="102" rx="7" fill="#0f172a"/>';
  for(const [x,col] of [[66,'#c084fc'],[113,'#60a5fa'],[207,'#67e8f9'],[291,'#f87171']]){
   b+='<line x1="'+x+'" y1="42" x2="'+x+'" y2="122" stroke="'+col+'" stroke-width="3.5"/>';
  }
  return frame('Illustrative discrete emission lines separated by dark regions',b);
 }
 return '';
}


function renderLevel(){const li=levelInfo(profile.lifetimeXp);document.getElementById('levelNum').textContent=li.level;document.getElementById('xpTotal').textContent=profile.lifetimeXp+' XP';document.getElementById('pointBalance').textContent=profile.points;document.getElementById('xpNext').textContent=li.level>=500?'Maximum level reached':(li.req-li.into)+' XP to level '+(li.level+1);document.getElementById('xpBar').style.width=(li.level>=500?100:clamp(li.into/li.req*100,0,100))+'%'}
function renderStats(){document.getElementById('dueCount').textContent=cards.filter(c=>c.active!==false&&isDue(c)).length;document.getElementById('newCount').textContent=daily().newCards;document.getElementById('reviewedCount').textContent=daily().reviews;document.getElementById('masteredCount').textContent=cards.filter(c=>state(c.id).mastered).length}
function avatarSVG(character,outfit,small=false){
 const c=character||CHARACTERS[0],o=outfit||OUTFITS.find(x=>x.id===c.id+'-default')||OUTFITS[0];
 const id=('art-'+c.id+'-'+o.id).replace(/[^a-zA-Z0-9-]/g,''),eye=c.eye||'#1e293b';
 const backHair=c.style==='long'||c.style==='bob'?'<path d="M34 64 Q35 19 80 19 Q124 21 128 72 L124 161 Q104 182 85 163 Q54 178 36 154Z" fill="url(#'+id+'-hair)"/>':'';
 const hairShapes={
 spiky:'M34 66 L38 33 L48 41 L53 15 L65 28 L77 7 L88 26 L103 12 L108 30 L125 23 L121 54 L129 68 Q85 47 34 66Z',
 messy:'M34 70 Q33 41 49 29 L53 13 L67 23 L77 11 L90 23 L105 12 L108 28 L121 26 L116 45 L126 65 Q93 49 75 53 L62 45 Q52 67 34 70Z',
 swept:'M37 69 Q30 41 45 25 Q68 11 95 20 Q121 26 124 56 L119 68 Q101 55 76 49 Q57 65 37 69Z',
 long:'M36 68 Q39 27 78 20 Q117 20 125 66 L115 66 Q95 46 78 45 Q60 64 36 68Z',
 bob:'M37 69 Q36 25 78 22 Q117 22 125 69 L112 93 L108 54 Q78 59 58 53 L48 94 Q34 82 37 69Z',
 short:'M40 66 Q37 30 65 22 Q96 10 116 37 L121 59 L111 67 Q94 50 78 48 Q57 65 40 66Z'
 };
 const hair=hairShapes[c.style]||hairShapes.short;
 let accessory='';
 if(c.accessory==='blindfold')accessory='<path d="M51 69 Q79 62 110 68 L107 86 Q79 90 52 84Z" fill="#111827" stroke="#334155" stroke-width="1.5"/><path d="M56 72 Q79 65 105 72" stroke="#475569" opacity=".65" fill="none"/>';
 else if(c.accessory==='glasses')accessory='<circle cx="67" cy="81" r="12" fill="rgba(219,234,254,.16)" stroke="#334155" stroke-width="2"/><circle cx="94" cy="81" r="12" fill="rgba(219,234,254,.16)" stroke="#334155" stroke-width="2"/><path d="M79 79 H82" stroke="#334155" stroke-width="2"/>';
 else if(c.accessory==='eyepatch')accessory='<path d="M52 73 Q64 67 79 74 L77 91 Q63 93 52 85Z" fill="#111827" stroke="#334155"/><path d="M42 62 L93 83" stroke="#111827" stroke-width="3"/>';
 else if(c.accessory==='scar')accessory='<path d="M98 88 l8 10 M101 85 l9 12" stroke="#7f1d1d" stroke-width="1.4"/>';
 else if(c.accessory==='stitches')accessory='<path d="M51 99 L65 104 M53 96 L58 110 M61 99 L65 108" stroke="#7f1d1d" stroke-width="1.2"/>';
 else if(c.accessory==='darkeyes')accessory='<ellipse cx="67" cy="86" rx="12" ry="6" fill="#0f172a" opacity=".22"/><ellipse cx="94" cy="86" rx="12" ry="6" fill="#0f172a" opacity=".22"/>';
 const style=o.styleId||'default';
 const hoodie=style==='hoodie'||style==='winter'?'<path d="M42 131 Q56 113 80 119 Q104 113 118 131 L114 148 Q101 130 80 137 Q59 130 46 148Z" fill="'+o.accent+'" stroke="rgba(15,23,42,.2)" stroke-width="1.5"/>':'';
 const lapels=style==='smart'||style==='traveller'?'<path d="M56 127 L78 149 L68 167 L51 137 Z M104 127 L82 149 L92 167 L109 137 Z" fill="'+o.accent+'" opacity=".96"/>':'';
 const gym=style==='sport'?'<path d="M52 138 L64 140 M96 140 L108 138" stroke="#f8fafc" stroke-width="5"/><path d="M80 150 V190" stroke="#f8fafc" stroke-width="3" opacity=".7"/>':'';
 const emblem=style==='festival'?'<path d="M80 157 L85 167 L98 169 L88 177 L91 190 L80 183 L69 190 L72 177 L62 169 L75 167Z" fill="'+o.accent+'"/>':'';
 const scarf=c.accessory==='scarf'?'<path d="M46 124 Q80 147 114 123 L114 145 Q81 161 47 144 L48 173 L34 180Z" fill="#991b1b" stroke="#7f1d1d"/>':'';
 return '<svg viewBox="0 0 160 190" role="img" aria-label="'+esc(c.name)+' in '+esc(o.name)+'">'+
 '<defs>'+
 '<linearGradient id="'+id+'-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+o.accent+'"/><stop offset=".55" stop-color="#dbeafe"/><stop offset="1" stop-color="#64748b"/></linearGradient>'+
 '<radialGradient id="'+id+'-skin" cx="34%" cy="26%" r="80%"><stop stop-color="#fff2de"/><stop offset=".35" stop-color="'+c.skin+'"/><stop offset="1" stop-color="#a16246"/></radialGradient>'+
 '<linearGradient id="'+id+'-hair" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="'+c.hair2+'"/><stop offset=".55" stop-color="'+c.hair+'"/><stop offset="1" stop-color="'+c.hair2+'"/></linearGradient>'+
 '<linearGradient id="'+id+'-cloth" x1="0" y1="0" x2="1" y2=".85"><stop stop-color="'+o.accent+'"/><stop offset=".38" stop-color="'+o.top+'"/><stop offset="1" stop-color="#101827"/></linearGradient>'+
 '<filter id="'+id+'-glow"><feGaussianBlur stdDeviation="11"/></filter>'+
 '</defs>'+
 '<rect width="160" height="190" rx="18" fill="url(#'+id+'-bg)"/>'+
 '<circle cx="126" cy="40" r="48" fill="#fff" opacity=".25" filter="url(#'+id+'-glow)"/>'+
 '<path d="M0 152 Q80 100 160 145 L160 190 H0Z" fill="#0f172a" opacity=".12"/>'+
 backHair+
 '<ellipse cx="79" cy="80" rx="40" ry="47" fill="url(#'+id+'-skin)" stroke="rgba(94,50,38,.25)" stroke-width=".7"/>'+
 '<ellipse cx="42" cy="88" rx="6" ry="12" fill="'+c.skin+'"/><ellipse cx="118" cy="88" rx="6" ry="12" fill="'+c.skin+'"/>'+
 '<path d="'+hair+'" fill="url(#'+id+'-hair)" stroke="'+c.hair2+'" stroke-width="1.4"/>'+
 '<path d="M44 51 Q76 21 108 43" stroke="#fff" opacity=".15" stroke-width="5" fill="none"/>'+
 '<path d="M54 72 Q65 66 74 71 M86 71 Q95 66 107 71" fill="none" stroke="'+c.hair2+'" stroke-width="2.6" stroke-linecap="round"/>'+
 '<path d="M53 80 Q67 72 77 80 Q67 88 53 80 M83 80 Q95 72 108 80 Q95 88 83 80" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>'+
 '<ellipse cx="66" cy="80" rx="5.2" ry="6.2" fill="'+eye+'"/><ellipse cx="95" cy="80" rx="5.2" ry="6.2" fill="'+eye+'"/>'+
 '<circle cx="64" cy="78" r="2" fill="#fff" opacity=".92"/><circle cx="93" cy="78" r="2" fill="#fff" opacity=".92"/>'+
 '<path d="M80 86 L76 101 L82 102" stroke="#965943" stroke-width="1.3" fill="none" opacity=".6"/>'+
 '<path d="M71 109 Q80 113 89 109" stroke="#884c43" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
 '<path d="M59 113 Q80 132 102 113" fill="none" stroke="#8b5545" opacity=".15"/>'+
 accessory+
 '<path d="M71 116 L71 134 Q79 144 90 134 L89 116" fill="url(#'+id+'-skin)"/>'+
 '<path d="M30 190 Q35 139 49 133 L65 126 Q80 147 96 126 L112 133 Q126 142 130 190Z" fill="url(#'+id+'-cloth)" stroke="#1e293b" stroke-width="1.4"/>'+
 '<path d="M63 128 Q80 145 97 128 L98 143 L80 159 L62 143Z" fill="'+o.accent+'" opacity=".82"/>'+
 hoodie+lapels+gym+emblem+scarf+
 '<path d="M52 154 L45 190 M108 154 L117 190" stroke="#fff" stroke-width="2" opacity=".17"/>'+
 '</svg>';
}
function renderAvatar(){
 const c=CHARACTERS.find(x=>x.id===profile.equippedCharacter)||CHARACTERS[0];
 let o=OUTFITS.find(x=>x.id===profile.equippedOutfit&&x.character===c.id);
 if(!o){o=OUTFITS.find(x=>x.id===c.id+'-default');profile.equippedOutfit=o.id}
 const l=LOCATIONS.find(x=>x.id===profile.equippedLocation)||LOCATIONS[0];
 document.getElementById('miniAvatar').innerHTML=characterArtwork(c,o);
 document.getElementById('characterPreview').innerHTML=characterArtwork(c,o);
 document.getElementById('equippedName').textContent=c.name;
 document.getElementById('equippedOutfitName').textContent=o.name+' outfit';
 document.getElementById('equippedLocation').textContent=l.name;
 document.getElementById('shopPoints').textContent=profile.points;
 selectedLocation=l.id;loadCharacterArt(document.getElementById('miniAvatar'));loadCharacterArt(document.getElementById('characterPreview'));
}
function renderChallenge(){document.getElementById('challengeStreak').textContent=profile.challengeStreak+' day'+(profile.challengeStreak===1?'':'s')+' streak';const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,key=dateKey()+'|'+(sub||'All')+'|'+scope,s=profile.dailyChallenges[key];document.getElementById('challengeStatus').textContent=s?(s.done?'Completed today · next streak bonus '+profile.challengeStreak+' point'+(profile.challengeStreak===1?'':'s'):( (s.index||0)+' / '+s.items.length+' completed')):'Not started yet';document.getElementById('startChallenge').textContent=s&&!s.done?'Resume challenge':s?.done?'Review challenge':'Start today’s challenge'}
function flashTopicLabel(c){return c.revisionTopic||c.topic||c.courseTopic||'Unclassified'}
function examTopicLabel(q){return q.revisionTopic||q.subtopic||q.topic||q.courseTopic||'Unclassified'}
function flashCourseFamily(c){
 const p=String(c.specRef||''),t=String(c.topic||''),u=String(c.unit||'');
 if(c.subject==='Physics'){
  if(p.startsWith('3.10')||u==='medical'||t.startsWith('Medical physics'))return '3.10 Medical physics (option)';
  if(p.startsWith('3.8')||u==='a2-nuclear')return '3.8 Nuclear physics';
  if(p.startsWith('3.7')||u.startsWith('a2-gravity')||u.startsWith('a2-electric')||u.startsWith('a2-capacitance')||u.startsWith('a2-magnetic')||u.startsWith('a2-induction'))return '3.7 Fields and their consequences';
  if(p.startsWith('3.6')||u==='a2-periodic'||u==='a2-thermal')return '3.6 Further mechanics and thermal physics';
  const core=[['as-measurements','3.1 Measurements and errors'],['as-particles','3.2 Particles and radiation'],['as-waves','3.3 Waves'],['as-mechanics','3.4 Mechanics and materials'],['as-electricity','3.5 Electricity']];
  for(const [prefix,label] of core)if(u===prefix)return label;
  const num=p.match(/^3\.[1-5](?=\.|$)/)?.[0];
  const byNum={'3.1':'3.1 Measurements and errors','3.2':'3.2 Particles and radiation','3.3':'3.3 Waves','3.4':'3.4 Mechanics and materials','3.5':'3.5 Electricity'};
  if(num&&byNum[num])return byNum[num];
 }else if(c.subject==='Chemistry'){
  const s=p.match(/^3\.[123](?:\.\d+)?/)?.[0];
  if(s?.startsWith('3.1'))return '3.1 Physical chemistry';
  if(s?.startsWith('3.2'))return '3.2 Inorganic chemistry';
  if(s?.startsWith('3.3'))return '3.3 Organic chemistry';
  const inorganic=new Set(['Periodicity','Period 3','Group 2','Group 7','Transition metals','Transition metal complexes','Aqueous ions','Aqueous metal ions','Period 3 oxides']);
  const organic=new Set(['Organic chemistry','Alkanes','Alkenes','Halogenoalkanes','Alcohols','Organic analysis','Optical isomerism','Aldehydes and ketones','Carboxylic acids','Esters','Acyl chlorides','Aromatic chemistry','Amines','Polymers','Amino acids','DNA','Proteins and DNA','Organic synthesis','NMR','NMR spectroscopy','Chromatography']);
  if(inorganic.has(t))return '3.2 Inorganic chemistry';
  if(organic.has(t)||t.startsWith('RP5 ')||t.startsWith('RP6 '))return '3.3 Organic chemistry';
  return '3.1 Physical chemistry';
 }else if(c.subject==='Maths'){
  if(['Statistics','Statistical distributions','Statistical sampling','Data presentation and interpretation','Probability','Hypothesis testing'].includes(t))return 'Statistics';
  if(['Mechanics','Forces','Moments','Kinematics','Quantities and units in mechanics'].includes(t))return 'Mechanics';
  return 'Pure mathematics';
 }
 return c.courseTopic||'Other';
}
function revisionTopicIndex(subject,qualification='both'){
 const groups=new Map();
 for(const c of subjectCards(subject)){
  const group=flashCourseFamily(c),topic=flashTopicLabel(c);
  if(!groups.has(group))groups.set(group,new Map());
  if(!groups.get(group).has(topic))groups.get(group).set(topic,{cards:0,questions:0});
  groups.get(group).get(topic).cards++;
 }
 for(const q of subjectExam(subject).filter(q=>qualification==='both'||q.level===qualification)){
  const group=q.courseTopic||'Other',topic=examTopicLabel(q);
  if(!groups.has(group))groups.set(group,new Map());
  if(!groups.get(group).has(topic))groups.get(group).set(topic,{cards:0,questions:0});
  groups.get(group).get(topic).questions++;
 }
 return groups;
}
function groupedTopicPicker(subject,kind,selected){
 const groups=revisionTopicIndex(subject,kind==='exam'?(document.getElementById('examLevel')?.value||'both'):'both');
 return [...groups].filter(([group,topics])=>[...topics.values()].some(v=>kind==='flash'?v.cards>0:v.questions>0)).sort((a,b)=>a[0].localeCompare(b[0])).map(([group,topics])=>{
  const count=[...topics.values()].reduce((n,c)=>n+(kind==='flash'?c.cards:c.questions),0);
  const groupId=group.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase();
  return '<details class="topic-family" open><summary><b>'+esc(group)+'</b><span>'+count+' '+(kind==='flash'?'cards':'questions')+'</span></summary>'+
  '<div class="topic-family-actions"><button type="button" data-topic-group-action="select" data-topic-group="'+esc(group)+'" data-topic-kind="'+kind+'">Select section</button>'+
  '<button type="button" data-topic-group-action="clear" data-topic-group="'+esc(group)+'" data-topic-kind="'+kind+'">Clear section</button></div>'+
  '<div class="topic-family-choices">'+[...topics].sort((a,b)=>a[0].localeCompare(b[0])).map(([topic,c])=>{
    const available=kind==='flash'?c.cards:c.questions;
    return '<label class="check-item '+(available?'':'empty-topic')+'"><input type="checkbox" data-'+kind+'-topic="'+esc(topic)+'" '+
      (selected.has(topic)?'checked ':'')+'><span>'+esc(topic)+'</span><small>'+available+'</small></label>';
  }).join('')+'</div></details>';
 }).join('');
}
function bindTopicGroupControls(kind){
 const container=document.getElementById(kind==='flash'?'flashTopics':'examTopics');
 const groupMap=revisionTopicIndex(document.getElementById(kind==='flash'?'flashSubject':'examSubject').value,kind==='exam'?document.getElementById('examLevel').value:'both');
 container.querySelectorAll('[data-topic-group-action]').forEach(btn=>btn.onclick=()=>{
  const group=btn.dataset.topicGroup,choices=groupMap.get(group),selected=kind==='flash'?flashTopics:examTopics;
  if(!choices)return;
  for(const [topic,count] of choices){
    if(btn.dataset.topicGroupAction==='clear')selected.delete(topic);
    else if((kind==='flash'?count.cards:count.questions)>0)selected.add(topic);
  }
  for(const input of container.querySelectorAll('[data-'+kind+'-topic]'))input.checked=selected.has(input.dataset[kind+'Topic']);
  renderTopicCounts();
 });
}
function refreshFlashTopics(defaultIfEmpty=false){
 const sub=document.getElementById('flashSubject').value,base=subjectCards(sub);
 const topics=[...new Set(base.map(flashTopicLabel))];
 flashTopics=new Set([...flashTopics].filter(t=>topics.includes(t)));
 if(defaultIfEmpty&&!flashTopics.size){flashScopeFilter='taught';base.filter(taughtCard).forEach(c=>flashTopics.add(flashTopicLabel(c)));}
 document.getElementById('flashTopics').innerHTML=groupedTopicPicker(sub,'flash',flashTopics);
 document.querySelectorAll('[data-flash-topic]').forEach(el=>el.onchange=()=>{el.checked?flashTopics.add(el.dataset.flashTopic):flashTopics.delete(el.dataset.flashTopic);renderTopicCounts()});bindTopicGroupControls('flash');
 renderTopicCounts();
}
function applyFlashPreset(p){
 flashScopeFilter=['mock','taught','all'].includes(p)?p:'all';
 const base=subjectCards(document.getElementById('flashSubject').value);flashTopics.clear();
 if(p!=='clear'){const filtered=p==='mock'?base.filter(mockEligibleCard):p==='taught'?base.filter(taughtCard):base;filtered.forEach(c=>flashTopics.add(flashTopicLabel(c)))}
 refreshFlashTopics(false);
}
const PMT_PAPER_INDEX={
 Physics:{
 'AS Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-1-as/',
 'AS Paper 2':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-2-as/',
 'A-level Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-1/',
 'A-level Paper 2':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-2/',
 'A-level Paper 3':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-3/'
 },
 Chemistry:{
 'AS Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-1-as/',
 'AS Paper 2':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-2-as/',
 'A-level Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-1/',
 'A-level Paper 2':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-2/',
 'A-level Paper 3':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-3/'
 },
 Maths:{
 'AS Papers 1 & 2':'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/papers-as/',
 'A-level Papers 1, 2 & 3':'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/papers/'
 }
};
const PMT_BY_TOPIC={
 Physics:'https://www.physicsandmathstutor.com/physics-revision/a-level-aqa/',
 Chemistry:'https://www.physicsandmathstutor.com/chemistry-revision/a-level-aqa/',
 Maths:'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/'
};
function renderPaperArchive(){
 const target=document.getElementById('paperArchiveLinks');
 if(!target)return;
 const subject=document.getElementById('examSubject').value;
 const codes={
  Physics:{AS:['7407/1','7407/2'],'A-level':['7408/1','7408/2','7408/3']},
  Chemistry:{AS:['7404/1','7404/2'],'A-level':['7405/1','7405/2','7405/3']},
  Maths:{AS:['7356/1','7356/2'],'A-level':['7357/1','7357/2','7357/3']}
 };
 // Independently verified public indexes that link on to the original AQA
 // PDFs. They are catalogues, not copies of those copyrighted papers.
 const SOURCE_CATALOGUES={
  Physics:{AS:'https://www.revisionlibrary.co.uk/past-papers/aqa/as-level/physics','A-level':'https://oscarsongtutoring.co.uk/physics/past-papers/7408'},
  Chemistry:{AS:'https://aqachemistry.co.uk/past-papers/as','A-level':'https://oscarsongtutoring.co.uk/chemistry/past-papers/7405'},
  Maths:{AS:'https://www.mymathscloud.com/modules/a-level/past-papers/aqa/as-year-1/','A-level':'https://freepastpapers.com/aqa/a-level/maths-7357'}
 };
  const first=subject==='Maths'?{AS:2018,'A-level':2018}:{AS:2016,'A-level':2017};
 const legacyLinks={
  Physics:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/',
  Chemistry:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/',
  Maths:'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/papers/'
 };
 const qp=examQuestions.filter(q=>q.subject===subject&&q.standalone!==false&&q.year!=='Practice');
 const sourceFirst=examQuestions.filter(q=>q.subject===subject&&q.standalone===false&&q.sourceFirst===true&&q.qpUrl&&q.msUrl);
 const sourceParts=examQuestions.filter(q=>q.subject===subject&&q.sourceVerified===true);
 const verifiedMarkTotals=sourceParts.filter(q=>q.originalMarkVerified===true).length;
  const indexUrl='https://www.aqa.org.uk/past-papers-and-mark-schemes-finder';
 const years=Array.from({length:12},(_,i)=>2026-i);
 function archiveLevel(year,level){
  if(year===2026) return codes[subject][level].map(paper=>
   '<div class="archive-paper-code"><span>'+esc(paper)+'</span><span class="archive-part-count archive-empty">0 indexed parts · public release 9 July 2027</span>'+
   '<a href="https://www.aqa.org.uk/exams-administration/exams/whats-available-when" target="_blank" rel="noopener noreferrer">AQA release schedule ↗</a></div>'
  ).join('');
  if(year<first[level])return '<span class="archive-nonexistent">Current syllabus not examined · <a href="'+legacyLinks[subject]+'" target="_blank" rel="noopener noreferrer">Older AQA specification papers ↗</a></span>';
  const papers=codes[subject][level].map(paper=>{
   const found=qp.filter(x=>x.year===year&&x.level===level&&
    (x.paper===paper||x.paper.startsWith(paper+'A')||x.paper.startsWith(paper+'B')));
   const sourceOnly=sourceFirst.filter(x=>x.year===year&&x.level===level&&x.paper===paper).length;
   const number=found.length,link=SOURCE_CATALOGUES[subject][level]||PMT_PAPER_INDEX[subject][
    subject==='Maths'?(level==='AS'?'AS Papers 1 & 2':'A-level Papers 1, 2 & 3'):
    (level==='AS'?'AS Paper '+paper.split('/')[1]:'A-level Paper '+paper.split('/')[1])
   ];
   // An official PDF link is provided only when one is already stored in
   // a source-verified bank entry; otherwise send students to a catalogue.
   const official=found.find(x=>x.sourceVerified===true&&
     /^https:\/\/filestore\.aqa\.org\.uk\//i.test(x.qpUrl||'')&&
     /^https:\/\/filestore\.aqa\.org\.uk\//i.test(x.msUrl||''));
   const originalQP=official?.qpUrl?.split('#')[0];
   const originalMS=official?.msUrl?.split('#')[0];
   // Archive links open original papers externally; they are not included
   // or redistributed by this application.
   return '<div class="archive-paper-code"><span>'+esc(paper)+'</span><span class="archive-part-count '+(number?'':'archive-empty')+'">'+
    number+' indexed '+(number===1?'part':'parts')+(sourceOnly?' · '+sourceOnly+' source-first':'')+'</span>'+
    (originalQP?'<a href="'+esc(originalQP)+'" target="_blank" rel="noopener noreferrer">Question paper ↗</a><a href="'+esc(originalMS)+'" target="_blank" rel="noopener noreferrer">Mark scheme ↗</a>':
     (link?'<a href="'+esc(link)+'" target="_blank" rel="noopener noreferrer" aria-label="Browse '+esc(subject+' '+level+' '+year+' '+paper)+' papers">Browse papers ↗</a>':'<a href="'+indexUrl+'" target="_blank" rel="noopener noreferrer">AQA catalogue ↗</a>'))+'</div>';
  });
  return papers.join('');
 }
 const archiveRows=years.map(year=>{
  const special=year===2026?'Summer 2026 papers not yet publicly released':
   year===2020?'Autumn examination series; no normal summer exams':
   year===2021?'Autumn exam series; no normal summer exams':
   year===2015?'Older, different specification':'';
  return '<tr><th scope="row">'+year+(special?'<span class="archive-context">'+esc(special)+'</span>':'')+
   '</th><td>'+archiveLevel(year,'AS')+'</td><td>'+archiveLevel(year,'A-level')+'</td></tr>';
 }).join('');
 target.innerHTML='<p class="archive-label">AQA '+esc(subject)+' · current-specification paper checklist, 2026–2015</p>'+
 '<p class="archive-verified-status"><b>'+verifiedMarkTotals+' of '+sourceParts.length+'</b> source-linked question parts in this subject have their <b>original mark totals</b> independently checked. This does not verify every answer, diagram or mark-scheme alternative.</p>'+
 '<p class="archive-help">AQA schedules the public release of summer 2026 AS and A-level question papers and mark schemes for <b>9 July 2027</b>; the 2026 row is an availability notice, not a source-verified paper index. The figure beside any older paper is the number of question parts indexed <b>inside Revision Loop</b>, not the number of questions on the original paper. <b>0 means no indexed parts.</b> Previously released papers and mark schemes may be available through external resources; the site does not reproduce full papers. The normal 2020 and 2021 summer examinations were cancelled; alternative autumn series were used. AQA files may use November session labels. Links marked "Question paper" are existing source-verified AQA PDFs; "Browse papers" links may lead to a subject index rather than a particular year.</p>'+
 '<div class="archive-scroll"><table class="archive-matrix"><thead><tr><th>Year</th><th>AS ('+esc(codes[subject].AS[0].split('/')[0])+')</th><th>A-level ('+esc(codes[subject]['A-level'][0].split('/')[0])+')</th></tr></thead><tbody>'+
 archiveRows+'</tbody></table></div>'+
 '<p class="archive-help"><a href="'+indexUrl+'" target="_blank" rel="noopener noreferrer">Official AQA paper and mark-scheme finder ↗</a> · '+
 '<a href="'+(subject==='Maths'?'https://www.aqa.org.uk/all-about-maths/a-level-maths':PMT_BY_TOPIC[subject])+'" target="_blank" rel="noopener noreferrer">Additional subject resources ↗</a>.'+
 ' AQA only provides most public past papers for a limited time. Some historical collections require school or teacher access. Older 2015 papers must be checked separately for syllabus differences.</p>';
 // Paper-dependent questions are useful only when the original source is open.
 // Keep them OUT of random sessions; expose an explicit paper-first workflow.
 const groupedSource=new Map();
 for(const q of sourceFirst){
  if(!groupedSource.has(q.groupId))groupedSource.set(q.groupId,[]);
  groupedSource.get(q.groupId).push(q);
 }
 const paperFirst=[...groupedSource.values()].sort((a,b)=>b[0].year-a[0].year||a[0].paper.localeCompare(b[0].paper));
 const sourceBlock=paperFirst.length?
  '<details class="archive-source-first"><summary>Open-source-paper questions · '+sourceFirst.length+' parts in '+paperFirst.length+' groups</summary>'+
  '<p>These question parts need the original AQA page, table or diagram. They are excluded from random revision until the source is opened. Click the paper and keep it visible while answering; marks remain reviewable.</p>'+
  paperFirst.map(group=>{
   const q=group[0];
   return '<div class="archive-source-row"><div><strong>'+esc(q.year+' · '+q.level+' · '+q.paper+' · Q'+q.question)+'</strong><small>'+group.length+' linked '+(group.length===1?'part':'parts')+' · original question paper needed</small></div>'+
    '<a href="'+esc(q.qpUrl)+'" target="_blank" rel="noopener noreferrer">Open original ↗</a>'+
    '<button type="button" data-source-first="'+esc(q.id)+'">Answer and mark</button></div>';
  }).join('')+'</details>':'';
 target.insertAdjacentHTML('beforeend',sourceBlock);
 target.querySelectorAll('[data-source-first]').forEach(button=>button.onclick=()=>{
  const chosen=sourceFirst.find(q=>q.id===button.dataset.sourceFirst);
  if(!chosen)return;
  const related=sourceFirst.filter(q=>q.groupId===chosen.groupId).sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));
  activeSession={kind:'exam',items:related.map(q=>({type:'exam',id:q.id,groupId:q.groupId})),index:0,title:'Original-paper assisted question'};
  studyType='exam';
  renderAll();
  document.getElementById('studyHost')?.scrollIntoView?.({block:'start',behavior:'smooth'});
 });
 
 const all=revisionTopicIndex(subject),gaps=[];
 for(const [group,topics] of all)for(const [topic,n] of topics)if(n.cards>0&&n.questions===0)gaps.push(topic);
 const sourced=new Map();
 for(const q of qp)sourced.set(q.revisionTopic,true);
 const notSourced=[];
 for(const [group,topics] of all)for(const [topic,n] of topics)if(n.cards>0&&!sourced.get(topic))notSourced.push(topic);
 document.getElementById('topicOutsideResources').innerHTML='<p class="archive-label">Topics without an indexed past-paper part: '+notSourced.length+'. These use independently written practice in the app, which should not be mistaken for original AQA questions. <a href="'+PMT_BY_TOPIC[subject]+'" target="_blank" rel="noopener noreferrer">Explore original AQA questions on PMT ↗</a></p>';
}
function refreshExamFilters(defaultIfEmpty=false){
 const sub=document.getElementById('examSubject').value,level=document.getElementById('examLevel').value,base=subjectExam(sub).filter(q=>level==='both'||q.level===level),
 years=[...new Set(base.map(q=>q.year))].sort((a,b)=>a==='Practice'?1:b==='Practice'?-1:b-a),
 yearOptions=[...Array.from({length:11},(_,i)=>2025-i),'Practice'],
 topics=[...new Set(subjectCards(sub).map(flashTopicLabel))],
 types=[...new Set(base.map(q=>q.questionType).filter(Boolean))].sort();
 examYears=new Set([...examYears].filter(y=>years.includes(y)));examTopics=new Set([...examTopics].filter(t=>topics.includes(t)));examTypes=new Set([...examTypes].filter(t=>types.includes(t)));
 if(defaultIfEmpty&&!examYears.size)years.forEach(y=>examYears.add(y));
 if(defaultIfEmpty&&!examTopics.size)base.forEach(q=>examTopics.add(examTopicLabel(q)));
 if(defaultIfEmpty&&!examTypes.size)types.forEach(t=>examTypes.add(t));
 const firstYear=sub==='Maths'?{AS:2018,'A-level':2018}:{AS:2016,'A-level':2017};
 document.getElementById('examYears').innerHTML=yearOptions.map(y=>{
  const available=years.includes(y),count=base.filter(q=>q.year===y).length,
   legacy=y!=='Practice'&&((level==='both'&&y<firstYear.AS)||(level!=='both'&&y<firstYear[level]));
  const desc=available?(count+' in app'):(legacy?'older specification · not indexed':'no questions indexed');
  const oldSpecNote=legacy?'title="The current AQA specification did not yet have this paper series. Use the older-specification archive separately."':'';
  return '<label class="check-item '+(available?'':'empty-topic')+'" '+oldSpecNote+'><input type="checkbox" data-exam-year="'+y+'" '+(available?'':'disabled ')+(examYears.has(y)?'checked':'')+'><span>'+y+'</span><small>'+desc+'</small></label>';
 }).join('');
 const indexedFromPapers=base.filter(q=>q.year!=='Practice').length;
 const practiceOnly=base.filter(q=>q.year==='Practice').length;
 let gap=0;
 const currentStart=sub==='Maths'?2018:(level==='AS'?2016:level==='A-level'?2017:2016);
 for(let yr=currentStart;yr<=2025;yr++)if(!base.some(q=>q.year===yr))gap++;
 let audit=document.getElementById('examArchiveAudit');
 if(!audit){audit=document.createElement('p');audit.id='examArchiveAudit';audit.className='archive-label';
  document.getElementById('examYears').insertAdjacentElement('afterend',audit)}
 audit.innerHTML=indexedFromPapers+' source-linked parts, '+practiceOnly+' original practice parts; '+gap+' current-specification year(s) without an indexed question for this selection. This is not a complete archive of every AQA question. Missing years stay disabled for random questions, but their full original papers can be found through the paper archive below. <a href="https://www.aqa.org.uk/past-papers-and-mark-schemes-finder" target="_blank" rel="noopener noreferrer">Find official AQA papers and mark schemes ↗</a>';
 document.getElementById('examTopics').innerHTML=groupedTopicPicker(sub,'exam',examTopics);
 document.getElementById('examTypes').innerHTML=types.map(t=>'<label class="check-item"><input type="checkbox" data-exam-type="'+esc(t)+'" '+(examTypes.has(t)?'checked':'')+'><span>'+esc(t)+'</span></label>').join('');
 document.querySelectorAll('[data-exam-year]').forEach(el=>el.onchange=()=>{el.checked?examYears.add(el.dataset.examYear==='Practice'?'Practice':Number(el.dataset.examYear)):examYears.delete(el.dataset.examYear==='Practice'?'Practice':Number(el.dataset.examYear));renderTopicCounts()});
 document.querySelectorAll('[data-exam-topic]').forEach(el=>el.onchange=()=>{if(el.checked)examTopics.add(el.dataset.examTopic);else examTopics.delete(el.dataset.examTopic);renderTopicCounts()});
 bindTopicGroupControls('exam');document.querySelectorAll('[data-exam-type]').forEach(el=>el.onchange=()=>{el.checked?examTypes.add(el.dataset.examType):examTypes.delete(el.dataset.examType)});
 renderTopicCounts();
 renderPaperArchive();
 const yearCounts=years.map(y=>y+': '+base.filter(q=>q.year===y).length).join(' · ');
 document.getElementById('examCoverage').textContent='Self-contained bank: '+base.length+' question parts (including separately labelled practice)'+(yearCounts?' · '+yearCounts:'')+'. Related subparts are grouped; missing-context questions are excluded. Coverage counts refer to app topic categories, not every individual specification requirement. Years with no indexed parts are visible but disabled; 2015 and earlier reform-era papers are in the separate legacy archive. Official past-paper coverage remains incomplete.';
}
function renderTopicCounts(){
 document.getElementById('flashTopicCount').textContent=flashTopics.size+' topics · '+selectedFlashCards().length+' eligible cards · '+(flashScopeFilter==='mock'?'mock only':flashScopeFilter==='taught'?'taught so far':'full A-level');
 document.getElementById('examTopicCount').textContent=examTopics.size+' selected';
 document.getElementById('examYearCount').textContent=examYears.size+' selected';
 const count=examGroups().reduce((n,g)=>n+g.length,0);
 const label=document.getElementById('examDifficultyCount');
 if(label)label.textContent=count+' question parts across selected groups. Linked parts stay together, even when some are shorter.';
}
function renderStudyType(){document.querySelectorAll('.study-type-btn').forEach(b=>b.classList.toggle('active',b.dataset.study===studyType));document.getElementById('mockControls').classList.toggle('hidden',studyType!=='mock');document.getElementById('flashControls').classList.toggle('hidden',studyType!=='flashcards');document.getElementById('examControls').classList.toggle('hidden',studyType!=='exam')}
function renderSessionBanner(){const e=document.getElementById('sessionBanner');if(!activeSession||activeSession.done){e.classList.add('hidden');return}e.classList.remove('hidden');e.textContent=activeSession.title+' · '+Math.min(activeSession.index+1,activeSession.items.length)+' / '+activeSession.items.length}
function renderCard(c){
 currentCardId=c.id;currentEvaluation=null;currentFlashAwarded=false;const s=state(c.id),health=Math.round(memoryHealth(c)*100),diag=c.visual?diagram(c.visual):'',backDiag=c.visualBack?diagram(c.visualBack):'';
 document.getElementById('studyHost').innerHTML='<article class="review-card"><div class="card-meta"><div class="meta-left"><span class="badge">'+esc(c.subject)+' · '+esc(c.courseTopic||c.topic)+'</span><span class="badge">'+esc(c.format==='cloze'?'fill in the gap':c.kind==='content'?'knowledge':c.kind)+'</span></div><span class="queue-pos">memory '+health+'%</span></div><div class="card-body">'+(diag?'<div class="diagram">'+diag+'</div>':'')+'<div class="question">'+esc(c.front)+'</div><textarea id="answerInput" class="answer-input" placeholder="Type your answer from memory…"></textarea><div class="answer-actions"><button id="checkCard" class="check-btn">Check answer</button><button id="revealCard" class="show-btn">Just reveal</button></div><div id="feedback" class="feedback"></div><div id="modelAnswer" class="model-answer"><b>Model answer:</b> '+esc(c.back)+(backDiag?'<div class="diagram diagram-answer">'+backDiag+'</div>':'')+'<div id="missingIdeas"></div></div><button id="overrideBtn" class="override-btn">My answer was actually correct</button><p class="flash-save-explainer">Correct checked answers earn +1 XP. Choose Again, Hard, Good or Easy to save your review, even if your answer was incorrect.</p><div id="ratings" class="ratings"><button class="rating again" data-rating="again">Again<small>~10 min</small></button><button class="rating hard" data-rating="hard">Hard<small>~1 day</small></button><button class="rating good" data-rating="good">Good<small>longer gap</small></button><button class="rating easy" data-rating="easy">Easy<small>much longer</small></button></div></div></article>';
 const reveal=(check)=>{const input=document.getElementById('answerInput').value;currentEvaluation=check?evaluateCard(c,input):{status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};if(currentEvaluation.status==='correct')awardFlashIfCorrect();const f=document.getElementById('feedback');f.className='feedback show '+currentEvaluation.status;f.textContent=currentEvaluation.text+(currentEvaluation.status==='correct'?' +1 XP awarded. Choose a rating to record the review.':currentEvaluation.status==='partial'?' Review recorded when you choose a rating; no XP awarded for a partly correct answer.':' Choose a rating to save your review; no XP awarded for this check.');document.getElementById('modelAnswer').classList.add('show');if(currentEvaluation.missing?.length)document.getElementById('missingIdeas').innerHTML='<ul class="missing-list">'+currentEvaluation.missing.map(x=>'<li>Missing: '+esc(x)+'</li>').join('')+'</ul>';document.getElementById('ratings').classList.add('show');if(currentEvaluation.status!=='correct')document.getElementById('overrideBtn').classList.add('show')};
 document.getElementById('checkCard').onclick=()=>reveal(true);document.getElementById('revealCard').onclick=()=>reveal(false);document.getElementById('overrideBtn').onclick=overrideFlashCorrect;document.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>rateCard(c,b.dataset.rating,document.getElementById('answerInput').value))
}
function evidenceRuleScore(answer,alternatives){
 if(!String(answer||'').trim())return 0;
 const present=tokens(answer);
 // A rule is satisfied by one complete group of matching concepts,
 // allowing spelling variation but not unrelated single keywords.
 return alternatives.some(group=>Array.isArray(group)&&group.length>=2&&group.every(term=>present.some(t=>close(t,term))))?1:0;
}
function enforceMarkDependencies(q,flags){
 if(!q.markPointDependencies||typeof q.markPointDependencies!=='object')return flags;
 const checked=[...flags];
 // Apply prerequisites repeatedly so chains work regardless of object-key order.
 // This applies only to suggested marks; manual marking remains reviewable.
 for(let pass=0;pass<checked.length;pass++){
  let changed=false;
  Object.entries(q.markPointDependencies).forEach(([index,prerequisites])=>{
   const i=Number(index);
   if(!Number.isInteger(i)||!checked[i]||!Array.isArray(prerequisites))return;
   if(prerequisites.some(p=>!checked[p])){checked[i]=false;changed=true}
  });
  if(!changed)break;
 }
 return checked;
}
function totalMarkingPoints(q,flags){
 // Some AQA questions say 'any three' out of a wider list of accepted
 // answers. Every distinct credited alternative must count equally.
 if(q.markingMode==='anyN')return Math.min(q.marks,flags.filter(Boolean).length);
 return clamp(flags.reduce((sum,on,i)=>sum+(on?(q.markPointMarks?.[i]??1):0),0),0,q.marks);
}
// Editor-vetted alternatives require a complete, substantive statement.
// One shared keyword or number is not evidence for an independent method mark.
function acceptedMarkPointAlternative(answer,variants,point){
 if(!Array.isArray(variants)||contradicts(answer,point))return false;
 const actual=' '+normalise(answer)+' ';
 return variants.some(variant=>{
  const phrase=normalise(variant);
  if(phrase.length<14||phrase.split(/\s+/).length<3)return false;
  const target=' '+phrase+' ';
  const pos=actual.indexOf(target);
  if(pos<0)return false;
  const preceding=actual.slice(Math.max(0,pos-16),pos);
  return !/(?:\bnot|\bnever|\bno)\s*$/.test(preceding);
 });
}

// Very short answers cannot establish several independent pieces of
// working in a multi-step task just because the words resemble many criteria.
// This is only a conservative suggested-score cap: students can correct it.
function singleClaimEvidenceCap(q,answer){
 if(q.requiresWorking!==true||q.marks<5||!Array.isArray(q.markPoints)||
    q.markPoints.length<4||q.answerType==='numeric')return null;
 const s=String(answer||'').trim();
 if(s.length<12||s.length>130||s.split(/\s+/).length>22)return null;
 if(/[;\n]|⇒|→|=>|\bthen\b/i.test(s))return null;
 if((s.match(/(?<![<>!])=(?![=>])/g)||[]).length>1)return null;
 if(s.split(/[.!?](?=\s|$)/).filter(Boolean).length>1)return null;
 return /\b(?:because|therefore|hence|thus|which|means|since|so|and)\b/i.test(s)?2:1;
}

// v201: exact, manually vetted short responses earn the relevant marks only.
function reviewedShortAnswerFlags(q,answer){
 const alternatives=q.reviewedShortAnswerPoints;
 if(!alternatives||typeof alternatives!=='object'||!Array.isArray(q.markPoints))return null;
 const raw=String(answer||'').trim();
 if(!raw||raw.length>350)return null;
 const claims=raw.split(/(?:[;\n]+|(?<=[.!?])\s+(?=[A-Za-z]))/).map(x=>x.trim()).filter(Boolean);
 if(!claims.length||claims.length>q.markPoints.length)return null;
 const canonical=s=>normalise(s).replace(/[.!?]+$/,'').trim();
 const flags=q.markPoints.map(()=>false);
 for(const claim of claims){
  const found=Object.entries(alternatives).filter(([key,list])=>{
   const index=Number(key);
   return Number.isInteger(index)&&index>=0&&index<flags.length&&Array.isArray(list)&&
     list.some(example=>canonical(claim)===canonical(example));
  });
  // Unknown, qualified and denied claims take the conservative marking route.
  if(!found.length)return null;
  for(const [index] of found)flags[Number(index)]=true;
 }
 return flags.some(Boolean)?flags:null;
}
function examSuggested(q,answer){
 // Graphs/diagrams and selected complete proofs require the student's actual work;
 // finding a few matching words must never award the proof or drawing marks.
 if(q.manualDiagramReview===true||q.manualWorkingReview===true){
  const empty=(q.markPoints||[]).map(()=>false);
  return {preds:empty,scores:empty.map(()=>0),suggested:0,finalCorrect:false,confidence:'low',manualRequired:true};
 }
 // v213: use reviewed independent evidence on four AS materials/circuit
 // questions; other answers retain ordinary, user-adjustable marking.
 if(/^task1_v203_phy_0[4-7]$/.test(String(q.id||''))){
  const adjusted=typeof window!=='undefined'?window.RevisionPhysicsMaterialsV213?.evaluate(q,answer):null;
  if(adjusted)return adjusted;
 }
 // v211: exact, independently calibrated physics short answers and negative
 // sign/unit statements. Unknown wording retains existing reviewable marking.
 if(/^task1_v203_phy_(?:01|03|08)$/.test(String(q.id||''))){
  const calibrated=typeof window!=='undefined'?window.RevisionPhysicsConciseV211?.evaluate(q,answer):null;
  if(calibrated)return calibrated;
 }
 // v210: use calculation-specific evidence for the new original mock data
 // questions. Never fall back to fuzzy matching that credits wrong signs.
 if(/^task1_v210_chem_0[1-5]$/.test(String(q.id||''))){
  const reviewed=typeof window!=='undefined'?window.RevisionChemRatesV210?.evaluate(q,answer):null;
  if(reviewed)return reviewed;
  return {preds:q.markPoints.map(()=>false),scores:q.markPoints.map(()=>0),
   suggested:0,finalCorrect:false,confidence:'low'};
 }
 // v209: independently reviewed reasoning marks for five hard original AS Pure
 // questions. Avoid generic token-overlap awarding marks for wrong numbers.
 if(/^task1_v209_maths_00[1-5]$/.test(String(q.id||''))){
  const result=typeof window!=='undefined'?window.RevisionPureMathsV209?.evaluate(q,answer):null;
  if(result)return result;
  return {preds:q.markPoints.map(()=>false),scores:q.markPoints.map(()=>0),
   suggested:0,finalCorrect:false,confidence:'low'};
 }
 // v191 questions require evidence tied to their particular calculations.
 // Do not use generic keyword overlap when the reviewed marking module is missing.
 if(/^originalAs191(?:Exhaust|Trig|Circle|Transform|Binomial|Area)$/.test(String(q.markingMode||''))){
  const result=typeof window!=='undefined'?window.RevisionPureMathsV191?.evaluate(q,answer):null;
  if(result)return result;
  return {preds:q.markPoints.map(()=>false),scores:q.markPoints.map(()=>0),
   suggested:0,finalCorrect:false,confidence:'low'};
 }

 // Independent evidence marks for four new original AS Pure multi-step tasks.
 // Avoid fuzzy token overlap crediting three proof steps for a single formula.
 if(/^origPure190(?:Proof6|OddSquare|Collinear|VectorRatio)$/.test(String(q.markingMode||''))){
  const raw=String(answer||'').trim().replace(/[−–—]/g,'-');
  const flat=raw.toLowerCase().replace(/\s+/g,'').replace(/³/g,'^3').replace(/²/g,'^2').replace(/¼/g,'1/4');
  const phrase=raw.toLowerCase();
  if(!raw||/^(?:idk|no idea|not sure|i don't know)\s*[.!]?$/i.test(raw))
   return {preds:q.markPoints.map(()=>false),scores:q.markPoints.map(()=>0),finalCorrect:false,confidence:'high',suggested:0};
  let flags=[];
  if(q.markingMode==='origPure190Proof6'){
   const factor=/(?:\(n-1\)n\(n\+1\)|n\(n-1\)\(n\+1\)|n\(n\+1\)\(n-1\))/.test(flat);
   const even=/\beven\b|divisible\s+by\s+2|multiple\s+of\s+2/i.test(phrase)&&/consecutive|n\s*[-+]\s*1|three\s+successive/i.test(phrase);
   const three=/(?:multiple|divisible)\s+(?:of|by)\s+3|factor\s+of\s+3/i.test(phrase)&&/consecutive|one|three|among/i.test(phrase);
   const conclusion=/divisible\s+by\s+6|multiple\s+of\s+6/i.test(phrase);
   flags=[factor,even,three,conclusion&&even&&three];
  }else if(q.markingMode==='origPure190OddSquare'){
   const deniedOdd=/\b(?:not|never)\s+(?:(?:an?|the)\s+)?(?:odd\s+integer\s+(?:is|as)\s+)?n\s*=\s*2[a-z]\s*[+-]\s*1\b|\bn\s*=\s*2[a-z]\s*[+-]\s*1\b[^.;\n]{0,28}\b(?:wrong|incorrect|false|not\s+correct|is\s+not|was\s+not)\b/i.test(raw);
   const odd=/n=2[a-z][+-]1(?!\d)/.test(flat)&&!deniedOdd;
   const square=/n\^2=(?:4k\(k\+1\)\+1|4k\(k-1\)\+1|4k\^2\+4k\+1|4k\^2-4k\+1|\(2k\+1\)\^2|\(2k-1\)\^2)/.test(flat)||
     /\(2k-1\)\^2=4k\(k-1\)\+1/.test(flat);
   const even=/\beven\b/i.test(phrase)&&/consecutive|k\s*\(\s*k\s*\+\s*1\s*\)/i.test(phrase);
   const conclusion=/n\^2=8[a-z]\+1/.test(flat)||(/remainder\s+(?:of\s+|is\s+)?1/i.test(phrase)&&/\b8\b/.test(phrase));
   flags=[odd,square,even,conclusion];
  }else if(q.markingMode==='origPure190Collinear'){
   const ab=/\bab=\(4,8\)/.test(flat),ac=/\bac=\(k\+1,18\)/.test(flat);
   const parallelStatement=/(?:\bab\b[^.;\n]{0,28}\bac\b|\bac\b[^.;\n]{0,28}\bab\b)[^.;\n]{0,24}\bparallel\b|\bab\b\s*(?:(?:is|=)\s*)?(?:\/\/|∥)\s*\bac\b|\bab\b\s+is\s+parallel\s+to\s+\bac\b|\bac\b\s+is\s+parallel\s+to\s+\bab\b/i.test(phrase);
   const deniedParallel=/\b(?:not|never)\s+parallel\b|(?:parallel|collinear)[^.;\n]{0,25}\b(?:wrong|incorrect|false)\b/i.test(phrase);
   const relation=/(?:\(k\+1\)\/4=18\/8|4\*18=8\*\(k\+1\))/.test(flat)||
     (/scalar\s+multiple/i.test(phrase)&&/\bab\b/i.test(phrase))||
     (parallelStatement&&!deniedParallel);
   const kValues=[...raw.matchAll(/\bk\s*=\s*([-+]?\d+(?:\.\d+)?)/gi)].map(m=>Number(m[1]));
   const deniedK=/\b(?:not|never|isn['’]?t|is\s+not)\s+(?:(?:the\s+)?(?:answer|result|value|solution)\s*(?:is\s*)?)?k\s*=\s*8\b|\bk\s*=\s*8\b[^.;\n]{0,28}\b(?:wrong|incorrect|false|not\s+correct)\b/i.test(raw);
   const correctK=kValues.includes(8)&&kValues.every(k=>k===8)&&!deniedK;
   const ratio=/ab:bc=4:5/.test(flat)||/\bbc=\(5,10\)/.test(flat);
   flags=[ab,ac,relation,correctK,ratio];
  }else{
   const ab=/\bab=\(12,12\)/.test(flat);
   const ap=/\bap=(?:1\/4ab|3,3|\(3,3\))/.test(flat)||/\bap=1\/4ab=\(3,3\)/.test(flat);
   const p=/\bp=\(5,-2\)/.test(flat);
   const cp=/\bcp=(?:p-c=)?\(6,-6\)/.test(flat);
   const mag=/6√2|6sqrt\(2\)|sqrt\(72\)|√72/.test(flat)&&/(?:cp|magnitude|length|\|)/.test(phrase);
   const rejectedUnit=/\b(?:unit\s+vector|direction\s+vector)[^.;\n]{0,28}\b(?:is|was)\s+(?:not|wrong|incorrect)\b|\b(?:not|never)\s+(?:the\s+)?(?:unit\s+vector|direction\s+vector)\b|\bunit\s+vector[^.;\n]{0,100}\b(?:is\s+wrong|is\s+incorrect)\b/i.test(phrase);
   const unit=/\(1\/√2,-1\/√2\)|\(√2\/2,-√2\/2\)|\(1\/sqrt\(2\),-1\/sqrt\(2\)\)/.test(flat)&&!rejectedUnit;
   flags=[ab,ap,p,cp,mag,unit];
  }
  const suggested=flags.filter(Boolean).length;
  return {preds:flags,scores:flags.map(ok=>ok?1:0),suggested,
   finalCorrect:suggested===q.marks,confidence:suggested===q.marks?'high':'medium'};
 }

// A curated equation is evidence only when it stands on its own: not within a
// longer variable/number, and not explicitly rejected by the student's wording.
// Whitespace around operators is insignificant; multiplication is not guessed.
function reviewedExpressionEvidence(answer,expression){
 const tidy=value=>{
  const digits={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
  const raw=String(value||'').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g,seq=>'^'+[...seq].map(x=>digits[x]).join(''));
  return normalise(raw)
   .replace(/(\d+(?:\.\d+)?)\s*(?:x|\*)\s*10\s*\^\s*([-+]?\d+)\b/gi,'$1e$2')
   .replace(/\s*([=+*/<>^])\s*/g,'$1');
 };
 const text=tidy(answer),formula=tidy(expression);
 if(formula.length<5||!text)return {matched:false,rejected:false};
 let at=0,rejected=false;
 while((at=text.indexOf(formula,at))>=0){
  const before=text.slice(0,at),after=text.slice(at+formula.length);
  at+=formula.length;
  // For example, 2.26e8 is not 12.26e8 or 2.26e80;
  // n=c/v must not be inferred from n=c/vx.
  if(/[a-z0-9.]$/i.test(before)||/^[a-z0-9.]/i.test(after))continue;
  const denial=/(?:\b(?:not|never|no|wrong|incorrect|invalid|without|avoid)\s*|\b(?:do not use|don't use|instead of|rather than)\s*)$/i.test(before.slice(-45));
  const rebuttal=/^\s*(?:is|was|would be)?\s*(?:wrong|incorrect|invalid|false)\b|^\s*but\s+(?:wrong|incorrect|invalid)\b/i.test(after.slice(0,45));
  if(denial||rebuttal){rejected=true;continue}
  return {matched:true,rejected:false};
 }
 return {matched:false,rejected};
}
 // A direct denial of a curated correct statement is not evidence for it.
 // This guard also prevents the older fuzzy matcher awarding other marks
 // for the same isolated, explicitly contradicted statement.
 const denied=String(answer||'').trim().match(/^(?:not|never)\s+(.+)$/i);
 const canonical=x=>normalise(x).replace(/[.!?]+$/,'').trim();
 if(denied&&(
  q.markPoints?.some(p=>canonical(p)===canonical(denied[1]))||
  q.markPointAcceptedAlternatives?.some(alts=>Array.isArray(alts)&&
   alts.some(v=>canonical(v)===canonical(denied[1]))))){
  return {preds:q.markPoints.map(()=>false),scores:q.markPoints.map(()=>0),
   finalCorrect:false,confidence:'high',suggested:0};
 }

 if(/^\s*(?:i (?:do not|don't|dont) know|idk|no idea|not sure|unsure)\s*[.!]?\s*$/i.test(String(answer||'')))return {preds:q.markPoints.map(()=>false),scores:q.markPoints.map(()=>0),finalCorrect:false,confidence:'high',suggested:0};
 // AQA source-first repairs (2020–21): award only the distinct
 // reasoning/results actually demonstrated, not keyword overlap.
 if(/^aqa(?:TrigErrors2020|TrigSolutions2020|ReciprocalShift2021|ReciprocalAsymptotes2021|CombustionDefinition2021|CombustionDiscrepancy2021)$/.test(String(q.markingMode||''))){
  const input=String(answer||'').toLowerCase().replace(/[−–—]/g,'-');
  let flags=[];
  switch(q.markingMode){
   case 'aqaTrigErrors2020':{
    const cancellation=/(?:cancel|divid|division|lost|excluded|forgot|ignor)[^.!?\n]{0,75}cos|cos\s*\(?y\)?\s*=\s*0\b|zero\s+cos/.test(input);
    const otherAngle=/(?:-60\b|±\s*60\b|negative\s+60\b)|(?:cos\s*\(?y\)?\s*=\s*0[.]5[^.!?\n]{0,65}(?:both|two|other|second|another))/i.test(input);
    flags=[cancellation,otherAngle];
    break;
   }
   case 'aqaTrigSolutions2020':{
    const expanded=input.replace(/±\s*(60|90)\b/g,' -$1 +$1 ');
    const rawAngles=[...expanded.matchAll(/(?<![\w.])[-+]?\d+(?:\.\d+)?(?=(?:\s*(?:°|º|degrees?\b|[,;\/\s\]\}]))|$)/g)].map(x=>Number(x[0]));
    const correct=new Set([-90,-60,60,90]);
    const distinct=new Set(rawAngles.filter(x=>correct.has(x)));
    const extras=rawAngles.some(x=>!correct.has(x));
    flags=[distinct.size>=2,distinct.size===4&&!extras];
    break;
   }
   case 'aqaReciprocalShift2021':{
    const expr=input.replace(/\s+/g,'').replace(/\u2212/g,'-');
    const good=/1\/\(x-3\)|\(x-3\)\^-1|\\frac\{1\}\{x-3\}/.test(expr);
    flags=[good];
    break;
   }
   case 'aqaReciprocalAsymptotes2021':{
    flags=[/\bx\s*=\s*3\b/.test(input),/\by\s*=\s*0\b/.test(input)];
    break;
   }
   case 'aqaCombustionDefinition2021':{
    const mole=/(?:\bone\s+mole\b|\b1\s*(?:mol|mole)\b)/.test(input);
    const oxygen=/(?:\boxygen\b|\bo2\b)/.test(input);
    const full=/(?:complet\w*[^.!?\n]{0,25}(?:burn|combust)|(?:burn|combust)\w*[^.!?\n]{0,25}complet\w*|fully\s+oxidis|fully\s+oxidiz)/.test(input);
    const states=/standard\s+states?/.test(input);
    const conditions=/(?:100\s*kpa|standard\s+conditions?)/.test(input);
    flags=[mole&&oxygen&&full,states&&conditions];
    break;
   }
   case 'aqaCombustionDiscrepancy2021':{
    const acceptable=/(?:(?:incomplete\s+(?:combustion|burning)|(?:fuel|sample)\s+(?:does\s+not|did\s+not)\s+burn\s+completely)|(?:fuel|sample|liquid|alcohol)[^.!?\n]{0,45}(?:evaporat|vaporis|vaporiz)|(?:evaporat|vaporis|vaporiz)[^.!?\n]{0,45}(?:fuel|sample|liquid|alcohol)|(?:non[-\s]?standard|not\s+(?:at|under)\s+standard)\s+(?:experiment\w*\s+)?(?:conditions?|temperatures?|pressures?))/i.test(input);
    flags=[acceptable];
    break;
   }
  }
  const score=flags.filter(Boolean).length;
  return {preds:flags,scores:flags.map(ok=>ok?1:0),suggested:score,
   finalCorrect:score===q.marks,confidence:score===q.marks?'high':'medium'};
 }
 // Three further 2024 source-first repairs. Keep each mark tied to
 // the student's actual reasoning rather than a coincidentally matching symbol.
 if(/^aqa(?:FactorTestError2024|FactorTestConclusion2024|QuadraticSet2024)$/.test(String(q.markingMode||''))){
  const source=String(answer||'').toLowerCase().replace(/[−–—]/g,'-');
  const flat=source.replace(/\s+/g,'').replace(/²/g,'^2')
    .replace(/\\sqrt\s*\{?\s*19\s*\}?/g,'√19')
    .replace(/sqrt\s*\(?\s*19\s*\)?/g,'√19')
    .replace(/\\cup/g,'∪');
  let preds=[];
  if(q.markingMode==='aqaFactorTestError2024'){
   const needed=/(?:f\s*\(\s*\+?2\s*\)|positive\s+2|evaluate\s+at\s+(?:x\s*=\s*)?\+?2|substitut\w*\s+\+?2|not\s+(?:at|use)\s+-2)/i.test(source);
   preds=[needed];
  }else if(q.markingMode==='aqaFactorTestConclusion2024'){
   const known=/(?:x\s*\+\s*2)/.test(source)&&/(?:is\s+(?:(?:definitely|certainly)\s+)?(?:a\s+)?factor|must\s+be\s+(?:a\s+)?factor|factor\s+(?:of|because|as|since))/.test(source);
   const uncertain=/(?:x\s*-\s*2)/.test(source)&&
    /(may\s+or\s+may\s+not|cannot\s+(?:know|tell|conclude|decide|establish|prove|determine)|can't\s+(?:know|tell|conclude|establish|prove)|not\s+enough|unknown|uncertain|not\s+proven|not\s+necessarily|no\s+conclusion|does\s+not\s+(?:decide|establish))/i.test(source);
   preds=[uncertain,known];
  }else{
   const quadratic=/(?:3x\^2\+2x-6(?:>|<|=)0)/.test(flat);
   const critical=/(?:\(-1±√19\)\/3|\(-1\+-?√19\)\/3)/.test(flat)||
     (flat.includes('(-1-√19)/3')&&flat.includes('(-1+√19)/3'));
   const outer=(flat.includes('x<')&&flat.includes('x>'))||
     /\boutside\s+(?:the\s+)?(?:two\s+)?roots?\b/.test(source);
   const setNotation=/(?:\{x[:|]|\u222a|\\cup|\(-∞)/.test(flat);
   preds=[quadratic,critical,outer,critical&&outer&&setNotation];
  }
  const awarded=preds.filter(Boolean).length;
  return {preds,scores:preds.map(x=>x?1:0),suggested:awarded,
    finalCorrect:awarded===q.marks,confidence:awarded===q.marks?'medium':'low'};
 }
 // Source-verified 2018 AQA AS Maths interval question: correct end-points
 // alone earn a method mark; the second mark needs an OPEN interval.
 // A wrong end-point must never be mistaken for the correct interval because
 // the answer shares one number with the scheme.
 // AQA 2018 AS Chemistry 7404/2 Q2.3 has a strict concordant-pair
 // selection followed by the mean. A generic numerical tolerance could
 // otherwise credit a mean calculated from the wrong set of titres.
 if(q.markingMode==='concordantTitres2018'){
  const raw=String(answer||'').replace(/,/g,' ').toLowerCase();
  const found=[...raw.matchAll(/(?<![\d.])(\d{2}\.\d+)(?![\d.])/g)].map(x=>Number(x[1]));
  const near=(x,y)=>Math.abs(x-y)<0.006;
  const hasPair=found.some(x=>near(x,23.90))&&found.some(x=>near(x,24.00));
  const mean=found.some(x=>near(x,23.95));
  // A correct exact mean can only come from the concordant pair,
  // but giving just the result does not demonstrate the requested choice.
  const allThreeMean=found.some(x=>near(x,23.86))&&!mean&&!hasPair;
  const validMean=mean||allThreeMean;
  const score=(hasPair?1:0)+(validMean?1:0);
  return {preds:[hasPair,validMean],scores:[hasPair?1:0,validMean?1:0],
    finalCorrect:mean,confidence:'high',suggested:score};
 }
 if(q.markingMode==='binomial3Terms'){
  const raw=String(answer||'').toLowerCase().replace(/\s+/g,'').replace(/[−–]/g,'-').replace(/²/g,'^2').replace(/×/g,'*');
  // M1: correct use of the first three binomial terms; A1: 4,6
  // coefficients; final A1: actual simplified polynomial, not just
  // an unevaluated expression with the correct coefficients.
  const correct=raw.includes('1-12x+54x^2')||raw.includes('1-12*x+54*x^2');
  const binomial=/1\+4\*?\(-?3x\)\+6\*?\(-?3x\)\^?2/.test(raw);
  const partial=/^54x\^?2$/.test(raw);
  const score=correct?3:binomial?2:partial?1:0;
  return {preds:[score>=1,score>=2,score===3],
    scores:[score>=1?1:0,score>=2?1:0,score===3?1:0],
    finalCorrect:score===3,confidence:'high',suggested:score};
 }
 if(q.markingMode==='strictOpenInterval'){
  const raw=String(answer||'').trim().toLowerCase().replace(/−/g,'-').replace(/π/g,'pi')
     .replace(/\bdegrees?\b/g,'').replace(/°/g,'').replace(/\s+/g,'');
  const radians=/(?:pi\/2).*?(?:3pi\/2)/.test(raw);
  const scan=String(answer||'').toLowerCase().replace(/−/g,'-').replace(/°/g,'').replace(/\bdegrees?\b/g,'');
  const nums=[...scan.matchAll(/(?<![\w.])(?:\d+(?:\.\d*)?|\.\d+)(?![\w.])/g)].map(x=>Number(x[0]));
  const endpoints=radians || (nums.length===2&&nums.includes(90)&&nums.includes(270));
  const closed=/(?:<=|>=|≤|≥)/.test(raw);
  const open=radians?(
    /pi\/2<x<3pi\/2/.test(raw)||/x>pi\/2(?:and|&&|,)?x<3pi\/2/.test(raw)
  ):(
    /90<x<270/.test(raw)||/270>x>90/.test(raw)||
    /x>90(?:and|&&|,)?x<270/.test(raw)||
    /^\(?90,270\)?$/.test(raw)||
    /between90and270/.test(raw)&&!closed
  );
  const score=endpoints?(open&&!closed?2:1):0;
  return {preds:[score>=1,score===2],scores:[score>=1?1:0,score===2?1:0],finalCorrect:score===2,confidence:'high',suggested:score};
 }
 // Two independently checked source questions require a particular *method*.
 // Do not infer proof/rationalisation marks from a bare correct result.
 if(q.markingMode==='stoppingRamp2018'){
  const raw=String(answer||'').toLowerCase().replace(/[−–]/g,'-').replace(/\s+/g,'');
  const distance=/(?:^|[^\d.])(?:36\.9|37(?:\.0+)?)(?=$|[^\d.])/.test(raw);
  const kinetic=/(?:2\.76(?:e6|×10\^?6|x10\^?6)|2760000|1\/2\*?m\*?v(?:\^2|²)|0\.5\*?18000\*?17\.5)/.test(raw);
  const height=/(?:^|[^\d.])15\.6(?=$|[^\d.])/.test(raw);
  const decel=/(?:4\.15|9\.81\*?sin\(?25|g\*?sin\(?25)/.test(raw);
  const first=distance||kinetic||decel;
  const second=distance||(kinetic&&height);
  const contradict=/(?:not\s*(?:long|enough|sufficient)|insufficient|too\s*short|will\s*not\s*stop)/i.test(String(answer||''));
  const conclusion=/(?:willstop|longenough|isenough|sufficient|safe|stopsbefore|yes)/.test(raw)&&
    /(?:85|ramp|lane)/.test(raw)&&!contradict;
  const preds=[first,first&&second,first&&second&&conclusion];
  return {preds,scores:preds.map(v=>v?1:0),
   suggested:preds.filter(Boolean).length,finalCorrect:preds[2],
   confidence:preds.every(Boolean)?'high':'medium'};
 }
 // 2022 AS Maths 7356/1 Q7: a numerical result is NOT a six-mark
 // calculation. M/A/B/R marks depend on integrating, valid limits and a
 // reasoned conclusion. AQA's original mark scheme uses six distinct stages.
 if(q.markingMode==='reasonedIntegralArea2022'){
  const raw=String(answer||'').toLowerCase().replace(/[−–—]/g,'-')
    .replace(/²/g,'^2').replace(/³/g,'^3').replace(/×|·/g,'*')
    .replace(/\\int/g,'∫').replace(/\s+/g,'');
  const roots=/x=±a|x=-a(?:,|;|and|or|&).*x=a|x=a(?:,|;|and|or|&).*x=-a|x=\\pm a|x=plusorminusa/.test(raw);
  const integral=/∫|integral|integrat|a\^2x-x\^3\/3|a\^2\*x-x\^3\/3/.test(raw);
  const primitive=/(?:a\^2\*?x-x\^3\/3|a\^2\*?x-\(?x\^3\)?\/3|a\^2\*?x-\(?1\/3\)?\*?x\^3|2a\^2\*?x-2\*?x\^3\/3)/.test(raw);
  const symmetric=/(?:∫|integral)[^=]{0,65}-a[^=]{0,35}a/.test(raw)&&
   !/∫[^=]{0,45}x=-a/.test(raw);
  const half=/(?:2\*?∫|2\*?integral|twicetheintegral)[^=]{0,35}(?:0[^=]{0,20}a|a[^=]{0,20}0)/.test(raw);
  const evaluated=/(?:4\*?a\^3\/3|4a\^3\/3|a\^3=27|27=a\^3)/.test(raw);
  const limits=(symmetric||half||(/\[\s*-a\s*,\s*a\s*\]/.test(raw)&&primitive))&&integral;
  const areaEquation=/(?:4\*?a\^3\/3=36|36=4\*?a\^3\/3|a\^3=27|27=a\^3)/.test(raw)||
   (limits&&/(?:=36|36=|=18|18=)/.test(raw));
  const conclusion=/(?:a=3(?:\.0+)?(?:[^\d.]|\.(?!\d)|$)|3=a(?:[^\d.]|\.(?!\d)|$))/.test(raw)&&evaluated;
  const flags=[roots,integral,integral&&primitive,limits,integral&&areaEquation,
   conclusion&&integral&&primitive&&areaEquation];
  return {preds:flags,scores:flags.map(on=>on?1:0),finalCorrect:flags[5],
   confidence:flags[5]?'high':'low',suggested:flags.filter(Boolean).length};
 }
 if(q.markingMode==='firstPrinciplesQuadratic2020'){
  const raw=String(answer||'').toLowerCase().replace(/[−–]/g,'-')
   .replace(/²/g,'^2').replace(/→|⇒|->/g,'to').replace(/\s+/g,'')
   .replace(/(?:\*\*)/g,'^');
  const setup=(/f\(x\+h\)|4\(x\+h\)\^2/.test(raw))&&
   (/f\(x\)|4x\^2\+x/.test(raw))&&(/\/h|overh|dividebyh/.test(raw));
  const expand=/8x\*?h/.test(raw)&&/4h\^2/.test(raw);
  const cancel=/8xh\+4h\^2\+h/.test(raw)||/8x\+4h\+1/.test(raw);
  const limit=(/lim|h(?:to|=)0|limitash/.test(raw))&&/8x\+1/.test(raw)&&cancel;
  const preds=[setup,expand,cancel,limit];
  return {preds,scores:preds.map(v=>v?1:0),suggested:preds.filter(Boolean).length,
   finalCorrect:limit,confidence:preds.every(Boolean)?'high':'medium'};
 }
 if(q.markingMode==='rationaliseSurd2024'){
  const raw=String(answer||'').toLowerCase().replace(/\s+/g,'').replace(/[−–]/g,'-')
   .replace(/\\sqrt\{?(\d+)\}?/g,'√$1').replace(/sqrt\(?(\d+)\)?/g,'√$1')
   .replace(/×|·/g,'*').replace(/\*/g,'*');
  const conjugate=/(?:√5\+√3|√3\+√5)/.test(raw)&&
    (/(?:√5-√3|√3-√5)/.test(raw)||/conjugate/.test(raw)||raw.includes('5-3'))&&
    (/\//.test(raw)||/numerator|denominator/.test(raw));
  const numerator=/(?:18\+4\*?√15|4\*?√15\+18|18\+2\*?√60)/.test(raw);
  const denominator=/(?:denominator(?:=|is)2|5-3=2|5-3\)?=2|\/2|over2)/.test(raw);
  const final=/(?:9\+2\*?√15|9\+√60|2\*?√15\+9|√60\+9)/.test(raw);
  const preds=[conjugate,numerator,denominator,final];
  return {preds,scores:preds.map(v=>v?1:0),suggested:preds.filter(Boolean).length,
   finalCorrect:final,confidence:preds.every(Boolean)?'high':'medium'};
 }
 // A standalone incorrect number (including a signed fraction) is not
 // evidence of any method. Earlier the opposite gradient -3/2 scored the
 // mark for the correct perpendicular tangent gradient +2/3.
 const rawNumeric=String(answer||'').trim();
 // AQA sometimes explicitly awards M marks to particular incorrect final
 // values. Only question-specific, source-verified examples are eligible.
 // Prevent arbitrary wrong numbers from earning any speculative credit.
 if(q.answerType==='numeric'&&Array.isArray(q.partialNumericMarkVariants)&&
   /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?\s*(?:%|[a-zA-Z°Ω]+)?$/i.test(rawNumeric)){
  const received=parseNumber(rawNumeric);
  const variant=q.partialNumericMarkVariants.find(item=>Number.isFinite(item.value)&&
    Math.abs(received-item.value)<=Math.max(1e-10,Math.abs(item.value)*.002));
  if(variant){
   const allowed=clamp(Math.trunc(variant.marks),0,q.marks-1);
   const flags=q.markPoints.map((_,i)=>i<allowed);
   return {preds:flags,scores:flags.map(on=>on?1:0),
     finalCorrect:false,confidence:'high',suggested:allowed};
  }
 }
 // Where the original mark scheme reserves a mark for standard form,
 // 5680000000 is not a full-mark replacement for 5.68×10^9.
 if(q.markingMode==='standardFormStrict'&&q.answerType==='numeric'&&
    numericMatch(q,rawNumeric)&&
    !/(?:e[+-]?\d+|(?:×|x|\*)\s*10\s*(?:(?:\^|\*\*)\s*[-+]?\d+|[⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+))/i.test(rawNumeric)){
  const partial=Math.max(0,q.marks-1);
  const flags=q.markPoints.map((_,i)=>i<partial);
  return {preds:flags,scores:flags.map(on=>on?1:0),finalCorrect:false,confidence:'high',suggested:partial};
 }
 const scalar=String(answer||'').trim();
 if(q.answerType==='numeric'&&
    /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?(?:\s*\/\s*[-+]?(?:\d+(?:\.\d*)?|\.\d+))?(?:\s*(?:%|[a-zA-ZΩ°]+))?$/i.test(scalar)&&
    !numericMatch(q,scalar)){
  return {preds:q.markPoints.map(()=>false),scores:q.markPoints.map(()=>0),finalCorrect:false,confidence:'high',suggested:0};
 }

 let scores=q.markPoints.map((p,i)=>{
   const strictEvidence=Array.isArray(q.markEvidenceRules?.[i]);
   const main=strictEvidence?evidenceRuleScore(answer,q.markEvidenceRules[i]):markPointPrediction(answer,p);
   // Never bypass an independently verified restrictive evidence rule.
   return strictEvidence?main:(typeof acceptedMarkPointAlternative==='function'&&acceptedMarkPointAlternative(answer,q.markPointAcceptedAlternatives?.[i],p)?1:main);
 });
 // Preserve equivalent formula notation without requiring the student's
 // algebra to reproduce the exact English marking-point sentence.
 // Only explicitly curated expressions are eligible for this shortcut.
 if(Array.isArray(q.markPointExpressionAlternatives)){
  q.markPointExpressionAlternatives.forEach((expressions,i)=>{
   if(i>=scores.length||!Array.isArray(expressions)||!expressions.length)return;
   const evidence=expressions.map(expr=>reviewedExpressionEvidence(answer,expr));
   if(evidence.some(e=>e.matched)){scores[i]=1;return}
   // This is a specific formula point, not a generic keyword point. In a short
   // formula-only response, fuzzy token overlap cannot replace the equation.
   const raw=String(answer||'').trim();
   const standaloneFormula=raw.length<=90&&raw.split(/\s+/).length<=8&&
    /[=/^]/.test(raw)&&/^[a-z]\w*\s*=/i.test(raw);
   if(evidence.some(e=>e.rejected)||standaloneFormula)scores[i]=0;
  });
 }
 let preds=scores.map(v=>v>=.5);
 const variants=(q.answerVariants||[]).map(x=>compact(x)).filter(Boolean);
 const exactVerbal=variants.length>0&&variants.includes(compact(answer));
 const finalCorrect=numericMatch(q,answer);
 const qt=String(q.questionType||'').toLowerCase();
 const requiresMethodInPrompt=/\b(?:show(?:\s+all)?\s+(?:your\s+)?working|justify\s+(?:your\s+)?answer|explain\s+(?:your\s+)?method|explain\s+why|show\s+that|prove\s+that)\b/i.test(q.prompt||'');
 // A correct final value can imply routine calculation-method marks, but not
 // extra explanations, diagrams or a separate requested quantity.
 const needsOtherWork=/\b(?:draw|sketch|explain|describe|justify|prove|derive|discuss|compare|state why|give a reason|show that|show your working)\b|\band\s+(?:state|give|explain|describe|justify|draw|sketch|identify|determine|calculate|find)\b/i.test(q.prompt||'');
 const ordinaryCalculation=q.answerType==='numeric'&&!/proof|show|explain|justify|derive|practical|evaluation/.test(qt)&&
   q.requiresWorking!==true&&!requiresMethodInPrompt&&!needsOtherWork;
 const inconsistentWorking=typeof window!=='undefined'&&window.RevisionScan?.hasArithmeticMistakes?.(answer)===true;
 const trustedFinal=finalCorrect&&!inconsistentWorking;
 if(trustedFinal&&ordinaryCalculation){
   // For an ordinary calculation where working is not compulsory, the correct result may imply method marks. The user reviews the suggestion.
   preds=preds.map(()=>true);
 }
 let suggested;
 if(Array.isArray(q.markPointMarks)&&q.markPointMarks.length===q.markPoints.length){
   suggested=preds.reduce((sum,on,i)=>sum+(on?(Number(q.markPointMarks[i])||0):0),0);
 }else{
   suggested=Math.round(preds.filter(Boolean).length/Math.max(1,q.markPoints.length)*q.marks);
 }
 if(trustedFinal&&ordinaryCalculation)suggested=q.marks;
 else if(finalCorrect){
  // When working is essential, numerical correctness gives final-answer credit,
  // but calculation-method points still need to be demonstrated.
  suggested=Math.max(suggested,Math.min(q.marks,1));
  if(inconsistentWorking)suggested=Math.min(suggested,Math.max(0,q.marks-1));
 }
 if(q.markingMode==='anyN')suggested=totalMarkingPoints(q,preds);
 if(exactVerbal&&q.requiresWorking!==true){suggested=q.marks;preds=preds.map(()=>true);}
 // Text/model answers get an extra equivalence check so algebraically or verbally equivalent forms are not rejected just for wording.
 if(q.modelAnswer&&String(answer||'').trim()){
   const modelMatch=Math.max(formulaScore(answer,q.modelAnswer),phraseScore(answer,q.modelAnswer));
   // Only give shortcut full credit when the model response is effectively complete.
   // A merely similar answer must be reviewed marking point by marking point.
   if(modelMatch>=.97&&q.marks<=2&&!contradicts(answer,q.modelAnswer)){suggested=Math.max(suggested,q.marks);preds=preds.map(()=>true)}
 }
 if(q.difficulty==='stretch'&&q.requiresWorking===true&&q.marks>=5){
  // Conservative marking: one correct intermediate line must not earn every
  // mark merely because it shares algebraic symbols with later marking points.
  // Deliberately favour manual confirmation over inflated automated scores.
  const clauses=String(answer||'').split(/(?:;|\n|⇒|→|=>|(?<=[.!?])\s+(?=\S))/)
    .map(x=>x.trim()).filter(x=>x.length>=3).length;
  const meaningfulWords=tokens(answer).filter(x=>x.length>=4).length;
  const evidenceCap=Math.min(q.marks,Math.max(1,clauses,Math.floor(meaningfulWords/12)));
  if(!(trustedFinal&&ordinaryCalculation))suggested=Math.min(suggested,evidenceCap);
 }
 if(q.answerType==='levels'&&q.marks>=4){
  const complete=preds.every(Boolean)&&String(answer).trim().split(/\s+/).length>=Math.max(20,q.markPoints.length*5);
  if(!complete)suggested=Math.min(suggested,Math.max(1,Math.ceil(q.marks*.66)));
}
 // A response consisting of exactly ONE listed marking-point statement
 // is evidence for that distinct point, not for the entire question.
 // Shared constants/formula symbols can otherwise trigger unrelated points.
 if(q.requiresWorking===true && q.markPoints.length>1 && String(answer||'').trim()){
  const singleIndex=q.markPoints.findIndex(point=>compact(point)===compact(answer));
  const singleAlternativeIndex=typeof acceptedMarkPointAlternative==='function'?q.markPointAcceptedAlternatives?.findIndex((alts,i)=>
    acceptedMarkPointAlternative(answer,alts,q.markPoints[i])&&
    alts.some(alt=>normalise(alt)===normalise(answer)))??-1:-1;
  const onlyIndex=singleIndex>=0?singleIndex:singleAlternativeIndex;
  if(onlyIndex>=0){
   preds=preds.map((_,i)=>i===onlyIndex);
   suggested=Number(q.markPointMarks?.[onlyIndex])||1;
  }
 }
 // A bare number or isolated keyword in a multi-part question cannot be
 // used as evidence for several separate methods/explanations. Older scorers
 // could award a full four-mark proof for "1" due to matching numerals.
 // This applies to multi-point rubrics only: ordinary numeric calculations
 // retain their full-credit final-answer policy.
 const rawAnswer=String(answer||'').trim();
 const isolatedNumber=/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?(?:\s*(?:%|[a-zA-ZΩ°]+))?$/i.test(rawAnswer);
 const isolatedWord=/^[a-zA-Z]{2,25}$/i.test(rawAnswer);
 if(q.answerType!=='numeric'&&q.markPoints.length>1&&(isolatedNumber||isolatedWord)){
  let allowable=preds.map((v,i)=>v?i:-1).filter(i=>i>=0);
  if(isolatedNumber){
   const num=parseNumber(rawAnswer);
   // Find a value explicitly stated as a result in the mark point.
   // Never confuse a quantity in the question with a demonstrated answer.
   allowable=allowable.filter(i=>{
    const p=String(q.markPoints[i]||'');
    const results=[...p.matchAll(/(?:=|≈|\b(?:is|gives?|equals?|approximately|about)\b)\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)(?![\w.])/gi)];
    return results.some(match=>{
     const expected=Number(match[1]);
     return Number.isFinite(num)&&Number.isFinite(expected)&&
       Math.abs(num-expected)<=Math.max(1e-9,Math.abs(expected)*.005);
    });
   });
  }
  const chosen=allowable.length?allowable[allowable.length-1]:-1;
  preds=preds.map((_,i)=>i===chosen);
  suggested=chosen>=0?Math.min(1,Number(q.markPointMarks?.[chosen])||1):0;
 }
 // Conditional marks in genuine AQA schemes: a justification cannot
 // score where the prerequisite experimental change was not justified.
 const permitted=[...preds];
 // The scoring fragment is also run in isolated marking tests, so keep this
 // fixed-point dependency check self-contained.
 if(q.markPointDependencies&&typeof q.markPointDependencies==='object'){
  for(let pass=0;pass<permitted.length;pass++){
   let changed=false;
   Object.entries(q.markPointDependencies).forEach(([index,prerequisites])=>{
    const i=Number(index);
    if(!Number.isInteger(i)||!permitted[i]||!Array.isArray(prerequisites))return;
    if(prerequisites.some(p=>!permitted[p])){permitted[i]=false;changed=true}
   });
   if(!changed)break;
  }
 }
 if(permitted.some((ok,i)=>ok!==preds[i])){
  preds=permitted;
  suggested=totalMarkingPoints(q,preds);
 }
 const singleClaimCap=typeof singleClaimEvidenceCap==='function'?singleClaimEvidenceCap(q,answer):null;
 if(singleClaimCap!==null)suggested=Math.min(suggested,singleClaimCap);
 // Exact reviewed claims override fuzzy matches, aligning the visible
 // marked points with their awarded marks, without guessing extra methods.
 const reviewedShortFlags=typeof reviewedShortAnswerFlags==='function'?reviewedShortAnswerFlags(q,answer):null;
 if(reviewedShortFlags){
  preds=reviewedShortFlags;
  suggested=totalMarkingPoints(q,preds);
  scores=preds.map(on=>on?1:0);
 }
 // The generic fuzzy matcher can mistake an explicitly wrong physical unit
 // for a valid final value. Apply only exact, individually reviewed rejects.
 if(Array.isArray(q.reviewedShortAnswerRejects)){
  const canonical=s=>normalise(s).replace(/[.!?]+$/,'').trim();
  if(q.reviewedShortAnswerRejects.some(bad=>canonical(answer)===canonical(bad))){
   preds=preds.map(()=>false);
   scores=preds.map(()=>0);
   suggested=0;
  }
 }
 const matched=preds.filter(Boolean).length,confidence=(q.answerType!=='numeric'&&q.markPoints.length>1&&(isolatedNumber||isolatedWord))?'low':finalCorrect||exactVerbal?'high':q.answerType==='levels'?'low':matched===q.markPoints.length?'medium':matched>=Math.ceil(q.markPoints.length/2)?'medium':'low';
 return {preds,scores,finalCorrect,confidence,suggested:clamp(suggested,0,q.marks)};
}

function examGraphDiagram(spec){
 if(!spec||!Array.isArray(spec.points)||spec.points.length<2)return '';
 const {xMin,xMax,yMin,yMax}=spec;
 if(![xMin,xMax,yMin,yMax].every(Number.isFinite)||xMax<=xMin||yMax<=yMin)return '';
 if(spec.points.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)))return '';
 const left=76,right=446,top=17,bottom=232,width=right-left,height=bottom-top;
 const X=x=>left+(x-xMin)/(xMax-xMin)*width;
 const Y=y=>bottom-(y-yMin)/(yMax-yMin)*height;
 const fmt=x=>String(Number(x.toPrecision(5)));
 const ticks=(min,max,step)=>{
  if(!(step>0)||!Number.isFinite(step))return [];
  const first=Math.ceil((min-1e-10)/step),last=Math.floor((max+1e-10)/step);
  if(last-first>25)return [];
  return Array.from({length:Math.max(0,last-first+1)},(_,i)=>Number(((first+i)*step).toPrecision(10)));
 };
 const escAttr=x=>esc(String(x||''));
 let out='<svg viewBox="0 0 470 289" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+escAttr(spec.description||'Question graph')+'" style="max-width:100%;height:auto">';
 for(const v of ticks(xMin,xMax,spec.xStep)){
  const x=X(v).toFixed(2);
  out+='<line x1="'+x+'" y1="'+top+'" x2="'+x+'" y2="'+bottom+'" stroke="currentColor" stroke-opacity=".13"/>';
  out+='<text x="'+x+'" y="'+(bottom+16)+'" fill="currentColor" font-size="11" text-anchor="middle">'+escAttr(fmt(v))+'</text>';
 }
 for(const v of ticks(yMin,yMax,spec.yStep)){
  const y=Y(v).toFixed(2);
  out+='<line x1="'+left+'" y1="'+y+'" x2="'+right+'" y2="'+y+'" stroke="currentColor" stroke-opacity=".13"/>';
  out+='<text x="'+(left-9)+'" y="'+(Number(y)+4)+'" fill="currentColor" font-size="11" text-anchor="end">'+escAttr(fmt(v))+'</text>';
 }
 const x0=xMin<=0&&xMax>=0?X(0):left,y0=yMin<=0&&yMax>=0?Y(0):bottom;
 out+='<line x1="'+left+'" y1="'+y0+'" x2="'+right+'" y2="'+y0+'" stroke="currentColor" stroke-width="1.5"/>';
 out+='<line x1="'+x0+'" y1="'+top+'" x2="'+x0+'" y2="'+bottom+'" stroke="currentColor" stroke-width="1.5"/>';
 out+='<polyline points="'+spec.points.map(p=>X(p[0]).toFixed(2)+','+Y(p[1]).toFixed(2)).join(' ')+'" fill="none" stroke="#247cc7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
 out+=spec.points.filter((p,i,a)=>i===0||i===a.length-1||p[0]!==a[i-1][0]&&p[1]!==a[i-1][1]).map(p=>'<circle cx="'+X(p[0]).toFixed(2)+'" cy="'+Y(p[1]).toFixed(2)+'" r="3.2" fill="#247cc7"/>').join('');
 out+='<text x="'+((left+right)/2)+'" y="269" fill="currentColor" text-anchor="middle" font-size="13">'+escAttr(spec.xLabel)+'</text>';
 out+='<text transform="translate(16 '+((top+bottom)/2)+') rotate(-90)" fill="currentColor" text-anchor="middle" font-size="13">'+escAttr(spec.yLabel)+'</text>';
 return out+'</svg>';
}
function renderExam(q){
 currentExamMarkingRoute='suggested';
 const prev=profile.examResults[q.id]?.last,diag=q.graphSpec?examGraphDiagram(q.graphSpec):(q.visual?diagram(q.visual):''),secondary=q.verificationLevel==='secondary-indexed',original=q.verificationLevel==='original-exam-style'||q.year==='Practice';
 const markStatusNote=original?'':q.originalMarkVerified?
  '<div class="copyright-note">Original mark total checked against the published AQA mark scheme.'+(q.answerType==='levels'?' This is a level-of-response question: the suggested checklist breakdown is not AQA\'s official point-by-point allocation. Review the overall explanation and level before accepting marks.':'')+'</div>':
  '<div class="copyright-note">The stated mark total is held in the question bank; its exact allocation has not yet been independently checked against the original AQA mark scheme. Use the linked scheme to verify it.</div>';
 const linked=examQuestions.filter(x=>x.groupId===q.groupId).sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));
 const linkedIndex=linked.findIndex(x=>x.id===q.id);
 const linkedNote=linked.length>1?'<div class="copyright-note">Linked original question · part '+(linkedIndex+1)+' of '+linked.length+'. Related parts are kept together in sessions.</div>':'';
 const qpOfficial=/^https:\/\/(?:filestore\.)?aqa\.org\.uk\//i.test(q.qpUrl||'');
 const msOfficial=/^https:\/\/(?:filestore\.)?aqa\.org\.uk\//i.test(q.msUrl||'');
 const sourceNote=original?'<div class="copyright-note">Original exam-style practice question, not an AQA past-paper question or official mark scheme.</div>':q.sourceFirst?'<div class="copyright-note">Source-linked entry: open the original question because its figure, table or context is needed.</div>':secondary?'<div class="copyright-note">2025 AQA paper entry cross-checked against external indexes. The adaptation is not certified identical to the original.</div>':'<div class="copyright-note">Adapted from a source-linked AQA question. Check exact wording, context and marks against the linked sources.</div>';
 document.getElementById('studyHost').innerHTML='<article class="exam-card"><div class="card-meta"><div class="meta-left"><span class="badge real">'+(original?'Original practice':secondary?'AQA 2025 · cross-checked':'AQA source-linked')+'</span><span class="badge">'+esc(q.subject)+' · '+esc(q.level)+'</span><span class="badge">'+esc(q.courseTopic||q.topic)+'</span></div><span class="queue-pos">'+esc(original?'Practice Q'+q.question:q.year+' '+q.paper+' Q'+q.question)+' · '+q.marks+' marks</span></div><div class="card-body">'+sourceNote+markStatusNote+linkedNote+'<div class="question-type">'+esc(q.questionType||'exam question')+'</div>'+(diag?'<div class="exam-visual">'+diag+'</div>':'')+'<div class="question">'+esc(q.prompt)+'</div>'+(original?'':'<div class="exam-source"><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.qpUrl)+'">'+(qpOfficial?'AQA question paper':'Question source/index')+'</a><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.msUrl)+'">'+(msOfficial?'AQA mark scheme':'Mark scheme source/index')+'</a></div>')+'<textarea id="examAnswer" class="answer-input" placeholder="Write your full working / answer here…"></textarea>'+(prev?'<div class="question-type">Previous score: '+prev.marks+'/'+prev.max+'</div>':'')+'<p class="exam-marking-help">'+(q.manualWorkingReview?'This is a full mathematical proof. The automatic keyword checker cannot reliably verify its logical steps. Compare the complete written proof with the marking points manually.':q.manualDiagramReview?'This question assesses a drawing. Use the on-page sketch or your own photographed diagram, then compare it manually with the marking points. The text checker cannot verify this drawing or graph.':'Suggested marks are not final: the checker can miss valid algebra, alternative methods, labelled diagrams and error-carried-forward work. Review each mark point and correct the total before saving.')+'</p><button id="markExam" class="check-btn">'+(q.manualWorkingReview?'Review proof marking points manually':q.manualDiagramReview?'Review diagram marking points manually':'Suggest marks (review before saving)')+'</button><button id="reviewExamManually" class="exam-report-link" type="button">Review marking points manually (diagrams / photos)</button><button id="reportExamIssue" class="exam-report-link" type="button">Copy question details to report an issue</button><span id="reportExamStatus" class="exam-report-status" role="status"></span><div id="examFeedback" class="feedback"></div><div id="examMarking" class="markscheme"></div><div id="scoreEditor" class="score-editor"></div></div></article>';
 window.RevisionScan?.mount(q.id);
 window.RevisionSketch?.mount(q);
 window.RevisionFree?.mount(q);
 window.RevisionVision?.mount(q);
 document.getElementById('reportExamIssue').onclick=async()=>{
  const report=['Revision Loop question issue','ID: '+q.id,'Subject: '+q.subject,'Level: '+q.level,
   'Year: '+q.year,'Paper: '+q.paper,'Question part: '+q.question,
   'Topic: '+(q.revisionTopic||q.topic),'Marks shown: '+q.marks,
   'Original mark total independently checked: '+(q.originalMarkVerified?'yes':'not yet'),
   'Question: '+q.prompt,'Your typed answer: '+(document.getElementById('examAnswer')?.value||'[no typed answer]').slice(0,5000),
   'Reviewed total (if marking shown): '+(document.getElementById('scoreEditor')?.classList.contains('show')?currentExamScore+'/'+q.marks:'not marked yet'),
   'Marking route: '+(currentExamMarkingRoute==='manual'?'Self-marked from original work / image':'Local suggested marks, then reviewed'),
   'Currently ticked criteria: '+[...document.querySelectorAll('[data-mp]')].filter(x=>x.checked).map(x=>Number(x.dataset.mp)+1).join(', '),
   'Marking criteria: '+(q.markPoints||[]).map((p,i)=>'['+(i+1)+'] '+p).join(' | '),
   'Question source: '+(q.qpUrl||'None'),'Mark scheme source: '+(q.msUrl||'None')].join('\n');
  const status=document.getElementById('reportExamStatus');
  try{
   await navigator.clipboard.writeText(report);
   if(status)status.textContent='Copied. Paste into ChatGPT and describe the problem.';
  }catch{
   if(status)status.textContent='Copy unavailable. Question ID: '+q.id;
  }
 };
 document.getElementById('reviewExamManually').onclick=()=>beginManualExamReview(q);
 document.getElementById('markExam').onclick=async()=>{
   // Original drawn diagrams and selected complete proofs cannot be credited from keywords.
   if(q.manualDiagramReview===true||q.manualWorkingReview===true){beginManualExamReview(q);return;}
   const submit=document.getElementById('markExam');
   if(submit?.disabled)return;
   if(submit){submit.disabled=true;submit.textContent='Reading and marking…'}
   try{
    const scan=window.RevisionScan;
    const photoCount=scan?.countFor(q.id)||0;
    const outcome=photoCount?await scan.prepareForMark(q.id,q):{ready:true,source:'typed'};
    if(!outcome?.ready){
      const ef=document.getElementById('examFeedback');
      if(ef){ef.className='feedback show neutral';ef.textContent=outcome?.message||'Please check your scanned working and try again.'}
      document.getElementById('examMarking')?.classList.remove('show');
      document.getElementById('scoreEditor')?.classList.remove('show');
      return;
    }
    if(!document.getElementById('examAnswer'))return;
   const answer=document.getElementById('examAnswer').value,res=examSuggested(q,answer),marking=document.getElementById('examMarking');
   const vision=window.RevisionVision?.resultFor(q.id)||null;
   const scannedText=Boolean(vision)||window.RevisionScan?.usedOCR(q.id)===true;
   const evidence=vision?vision.marking.map(p=>({
     strong:p.earned===true,line:p.evidence||'',reason:p.reason||'',confidence:p.confidence||'low'
   })):(scannedText?window.RevisionScan?.reviewEvidence(q,answer,res):null);
   if(scannedText&&!vision&&Array.isArray(evidence)&&Array.isArray(q.markPointAcceptedAlternatives)){
    const arithmeticConcern=window.RevisionScan?.hasArithmeticMistakes?.(answer)===true;
    q.markPointAcceptedAlternatives.forEach((alternatives,i)=>{
     if(!arithmeticConcern&&!Array.isArray(q.markEvidenceRules?.[i])&&
       acceptedMarkPointAlternative(answer,alternatives,q.markPoints[i])&&evidence[i]){
      evidence[i].strong=true;
      evidence[i].line='Accepted alternative found in reviewed transcription';
      evidence[i].reason='Provisional match to a vetted equivalent; confirm against the attached photo.';
     }
    });
   }
   if(scannedText&&!vision&&Array.isArray(q.markEvidenceRules)&&Array.isArray(evidence)){
    const matched=res.preds;
    for(let i=0;i<evidence.length;i++)if(Array.isArray(q.markEvidenceRules[i])){
      evidence[i].strong=Boolean(matched[i]);
      evidence[i].line=matched[i]?'Concept matched in reviewed transcription':'';
      evidence[i].reason=matched[i]?'Accepted alternative wording':'No complete criterion found';
    }
   }
   if(scannedText&&Array.isArray(evidence)){
    res.preds=enforceMarkDependencies(q,res.preds.map((_,i)=>Boolean(evidence[i]?.strong)));
    res.suggested=totalMarkingPoints(q,res.preds);
    res.confidence=vision?(vision.uncertain?'low':'medium'):'low';
   }
   currentExamMarkingRoute='suggested';
   marking.classList.add('show');
   marking.innerHTML='<b>'+(q.year==='Practice'?'Practice marking criteria:':'Question marking criteria:')+'</b>'+(q.markingMode==='anyN'?'<p class="copyright-note">Any '+q.marks+' distinct valid points can earn '+q.marks+' marks, even if more alternatives are shown.</p>':'')+'<div class="markpoint-grid">'+q.markPoints.map((p,i)=>'<label class="markpoint '+(res.preds[i]?'predicted':'')+'"><input type="checkbox" data-mp="'+i+'" '+(res.preds[i]?'checked':'')+'><span>'+'<b class="point-weight">'+(q.markingMode==='anyN'?'Accepted point':(q.markPointMarks?.[i]??1)+' mark'+((q.markPointMarks?.[i]??1)===1?'':'s'))+'</b> '+esc(p)+(Array.isArray(q.markPointAcceptedAlternatives?.[i])&&q.markPointAcceptedAlternatives[i].length?'<small class="mark-alternatives">Also accept: '+q.markPointAcceptedAlternatives[i].map(esc).join(' · ')+'</small>':'')+(scannedText?'<small class="scan-evidence '+(evidence?.[i]?.strong?'scan-evidence-found':'')+'">'+(evidence?.[i]?.strong?'Likely evidence: “'+esc((evidence[i].line||'').slice(0,175))+'”'+(vision&&evidence[i].reason?' — '+esc(evidence[i].reason):''):(vision?'Not awarded: '+esc((evidence?.[i]?.reason||'No clear evidence detected.').slice(0,210)):'No matching step identified; check the photograph and decide manually.'))+'</small>':'')+'</span></label>').join('')+'</div>'+(q.modelAnswer?'<p><b>Model outcome:</b> '+esc(q.modelAnswer)+'</p>':'')+(q.answerType==='numeric'?'<p><b>Checked numerical answer:</b> '+q.numericAnswer+(q.unit?' '+esc(q.unit):'')+'</p>':'')+
    (q.officialMarkingNotes?'<p class="official-marking-note"><b>AQA marking detail:</b> '+esc(q.officialMarkingNotes)+'</p>':'')+
    (q.ecfGuidance?'<p class="official-marking-note"><b>Error carried forward:</b> '+esc(q.ecfGuidance)+' Check the actual substitution and method before awarding a point; this is not automatic credit.</p>':'');
   currentExamScore=res.suggested;manualScoreOverride=false;
   const ef=document.getElementById('examFeedback');ef.className='feedback show '+(scannedText?'neutral':res.finalCorrect?'correct':'neutral');
   ef.textContent=vision?(vision.source==='chatgpt-manual-import'?'ChatGPT suggestions imported: '+res.suggested+'/'+q.marks+' provisional marks. This was not checked directly by Revision Loop; compare every tick with your answer before saving. '+(vision.reviewNotes||''):'AI vision suggested '+res.suggested+'/'+q.marks+' provisional marks by inspecting the photograph directly. Check every credited method step and adjust marks before saving. '+(vision.uncertain?'Some handwriting was uncertain. ':'')+(vision.reviewNotes||'')):scannedText?'Suggested '+res.suggested+'/'+q.marks+' marks from your corrected transcription. Evidence is shown beside each proposed mark. Handwritten symbols and method steps can be misread, so adjust every check before saving.':res.finalCorrect?'High-confidence check: final numerical answer matches. Method marks are checked below.':'Auto-check confidence: '+res.confidence+'. It checks equivalent wording, ordinary spelling errors, formulas and direct contradictions. Review highlighted marking points before saving.';
   renderScoreEditor(q,answer);
   document.querySelectorAll('[data-mp]').forEach(el=>el.onchange=()=>{
     currentExamScore=totalMarkingPoints(q,[...document.querySelectorAll('[data-mp]')].map(el=>el.checked));manualScoreOverride=false;
     renderScoreEditor(q,answer);
   });
   }catch(error){
     const ef=document.getElementById('examFeedback');
     if(ef){ef.className='feedback show neutral';ef.textContent='Could not mark this photograph. It is still attached. You can retry or correct the recognised transcription. No marks have been saved.'}
     document.getElementById('scoreEditor')?.classList.remove('show');
     console.warn('Revision Loop marking error',error);
   }finally{
     const button=document.getElementById('markExam');
     if(button){button.disabled=false;button.textContent='Suggest marks (review before saving)'}
   }
 };
}


function beginManualExamReview(q){
 // Manual route for photographed working, mechanisms and sketches which local OCR
 // cannot reliably read. No marks are suggested or awarded automatically here.
 const marking=document.getElementById('examMarking');
 const feedback=document.getElementById('examFeedback');
 if(!marking||!feedback||!Array.isArray(q.markPoints))return;
 const answer=document.getElementById('examAnswer')?.value||'';
 currentExamMarkingRoute='manual';
 currentExamScore=0;manualScoreOverride=false;
 const type=q.year==='Practice'?'Practice marking criteria':'Question marking criteria';
 marking.classList.add('show');
 marking.innerHTML='<b>'+type+' — mark your work point by point</b>'+
  '<p class="copyright-note">Self-assessment, not automated verification. Compare the original drawing/photo and any written working with each criterion, tick only genuinely demonstrated steps, and check the linked official mark scheme where available. No boxes start ticked.</p>'+
  (q.markingMode==='anyN'?'<p class="copyright-note">Any '+q.marks+' distinct acceptable points may count, up to '+q.marks+' marks.</p>':'')+
  (q.answerType==='levels'?'<p class="copyright-note">This is a level-of-response question. The checklist is guidance, not necessarily the official AQA level descriptor. Set the overall mark using the full response.</p>':'')+
  '<div class="markpoint-grid">'+q.markPoints.map((p,i)=>{
   const weight=q.markingMode==='anyN'?'Accepted point':(q.markPointMarks?.[i]??1)+' mark'+((q.markPointMarks?.[i]??1)===1?'':'s');
   const alternatives=q.markPointAcceptedAlternatives?.[i];
   const requirements=q.markPointDependencies?.[i];
   return '<label class="markpoint"><input type="checkbox" data-mp="'+i+'"><span><b class="point-weight">'+weight+'</b> '+esc(p)+
    (Array.isArray(alternatives)&&alternatives.length?'<small class="mark-alternatives">Also accept: '+alternatives.map(esc).join(' · ')+'</small>':'')+
    (Array.isArray(requirements)&&requirements.length?'<small class="mark-alternatives">Normally depends on point(s): '+requirements.map(n=>Number(n)+1).join(', ')+'</small>':'')+
    '</span></label>';
  }).join('')+'</div>'+
  (q.modelAnswer?'<p><b>Model outcome:</b> '+esc(q.modelAnswer)+'</p>':'')+
  (q.answerType==='numeric'?'<p><b>Checked numerical answer:</b> '+esc(q.numericAnswer)+(q.unit?' '+esc(q.unit):'')+'</p>':'')+
  (q.officialMarkingNotes?'<p class="official-marking-note"><b>AQA marking detail:</b> '+esc(q.officialMarkingNotes)+'</p>':'')+
  (q.ecfGuidance?'<p class="official-marking-note"><b>Error carried forward:</b> '+esc(q.ecfGuidance)+' Check the actual substitution and method; credit is not automatic.</p>':'');
 feedback.className='feedback show neutral';
 feedback.textContent='Manual review opened. No handwriting or diagram has been automatically read or credited. Check your own evidence and mark each point before saving.';
 renderScoreEditor(q,answer);
 document.querySelectorAll('[data-mp]').forEach(box=>box.onchange=()=>{
  const checked=[...document.querySelectorAll('[data-mp]')].map(el=>el.checked);
  currentExamScore=totalMarkingPoints(q,checked);manualScoreOverride=false;
  renderScoreEditor(q,answer);
 });
}

function renderScoreEditor(q,answer){const ed=document.getElementById('scoreEditor');ed.classList.add('show');const checks=[...document.querySelectorAll('[data-mp]')].map(el=>el.checked);const checkboxTotal=totalMarkingPoints(q,checks);const overridden=checkboxTotal!==currentExamScore;const missed=q.markPoints.filter((_,i)=>!document.querySelector('[data-mp="'+i+'"]')?.checked);ed.innerHTML='<div class="score-line"><strong>Reviewable mark: '+currentExamScore+'/'+q.marks+'</strong><span>Tick valid alternative steps or correct the total</span></div><p class="mark-fairness-note">Equivalent correct methods, valid labelled diagrams and working with a carried-forward error may deserve credit even if the checker missed them. Tick the corresponding mark point or change the total. Save your reviewed score.</p>'+(overridden?'<p class="copyright-note">'+(manualScoreOverride?'Manual total override':'Conservative automatic estimate')+': '+currentExamScore+'/'+q.marks+' differs from '+checkboxTotal+'/'+q.marks+' checked marking points. The ticked criteria were not changed by this total; review both before saving.</p>':'')+'<div class="mark-buttons">'+Array.from({length:q.marks+1},(_,i)=>'<button class="mark-btn '+(i===currentExamScore?'selected':'')+'" data-score="'+i+'">'+i+'</button>').join('')+'</div>'+(missed.length?'<div class="missed-summary"><b>Likely missing:</b> '+missed.map(esc).join(' • ')+'</div>':'<div class="feedback show correct">No mark-scheme point is currently flagged as missing.</div>')+'<button id="saveExamScore" class="primary-btn save-score">Save '+currentExamScore+'/'+q.marks+'</button>';document.querySelectorAll('[data-score]').forEach(b=>b.onclick=()=>{currentExamScore=Number(b.dataset.score);manualScoreOverride=true;renderScoreEditor(q,answer)});document.getElementById('saveExamScore').onclick=()=>{const mp=q.markPoints.filter((_,i)=>!document.querySelector('[data-mp="'+i+'"]')?.checked);awardExam(q,currentExamScore,answer,mp)}}
function renderStudy(){
 renderStudyType();renderSessionBanner();
 if(activeSession?.done){document.getElementById('studyHost').innerHTML='<div class="empty-card"><h3>Session complete</h3><p>Your results have been saved into the memory and weakness model.</p><button id="endSession" class="primary-small">Finish</button></div>';document.getElementById('endSession').onclick=()=>{activeSession=null;renderAll()};return}
 if(!activeSession){document.getElementById('studyHost').innerHTML='<div class="empty-card"><h3>Choose what you want to revise</h3><p>Select multiple topics above, then start a random session. Weak areas are more likely to appear without making the order predictable.</p></div>';return}
 const item=activeSession.items[activeSession.index];if(!item){activeSession.done=true;renderStudy();return}const obj=item.type==='card'?cards.find(c=>c.id===item.id):examQuestions.find(q=>q.id===item.id);if(!obj){activeSession.index++;renderStudy();return}item.type==='card'?renderCard(obj):renderExam(obj)
}
function renderWeak(){
 const byTopic=new Map();
 for(const c of cards.filter(x=>x.active!==false)){
  const topic=c.revisionTopic||c.topic,key=c.subject+'|'+topic;
  let row=byTopic.get(key);if(!row){row={subject:c.subject,topic,cardCount:0,worstMemory:100,totalMemory:0,maxWeakness:0};byTopic.set(key,row)}
  const memory=Math.round(memoryHealth(c)*100);
  row.cardCount++;row.totalMemory+=memory;row.worstMemory=Math.min(row.worstMemory,memory);row.maxWeakness=Math.max(row.maxWeakness,weakness(c));
 }
 const entries=[...byTopic.values()].map(x=>({...x,memory:Math.round(x.totalMemory/x.cardCount)})).sort((a,b)=>b.maxWeakness-a.maxWeakness).slice(0,45);
 document.getElementById('weakList').innerHTML=entries.map(x=>{
  const ts=topicStat(x.subject,x.topic),acc=ts.examMax?Math.round(ts.examMarks/ts.examMax*100):null;
  const cls=x.memory>=85?'memory-good':x.memory>=60?'memory-mid':'memory-low';
  return '<div class="list-row"><div><strong>'+esc(x.topic)+'</strong><small>'+
    esc(x.subject)+' · '+x.cardCount+' cards · average memory '+x.memory+'% · lowest '+x.worstMemory+'%'+
    (acc!==null?' · exam '+acc+'%':'')+'</small></div><span class="memory-pill '+cls+'">'+Math.round(x.maxWeakness)+'</span></div>';
 }).join('')||'<div class="empty-card">No weaknesses recorded yet.</div>';
 const r=profile.errorLog.slice(0,30);document.getElementById('mistakeList').innerHTML=r.length?r.map(e=>'<div class="list-row"><div><strong>'+esc(e.topic)+'</strong><small>'+esc(e.subject)+' · '+esc(e.type==='exam'?'exam '+e.result:e.result)+(e.missedPoints?.length?' · missed: '+esc(e.missedPoints.slice(0,2).join(' / ')):'')+'</small></div><span class="score-pill">'+new Date(e.date).toLocaleDateString(undefined,{day:'numeric',month:'short'})+'</span></div>').join(''):'<div class="empty-card">No recorded mistakes yet.</div>';
}

const AQA_SYLLABUS={
 Physics:[
  ['Measurements and their errors',/Measurements & practical skills|Measurements|Practical skills/i],
  ['Particles and radiation',/Particles & radiation|Particle physics|Photon|Photoelectric|Energy levels/i],
  ['Waves',/^Waves$|Interference|Diffraction|Polarisation|Refraction|Stationary waves/i],
  ['Mechanics and materials',/Mechanics & materials|Newton|Couples|Free-body|Energy|Materials|Vectors|Forces on a slope/i],
  ['Electricity',/^Electricity$|EMF|Resistivity|Potential dividers/i],
  ['Further mechanics',/Circular motion|SHM|Resonance/i],
  ['Thermal physics',/Thermal physics|Kinetic theory|Gas laws/i],
  ['Fields and their consequences',/Gravitational fields|Electric fields|Magnetic fields|Capacitance|Electromagnetic induction/i],
  ['Nuclear physics',/Nuclear physics|Radioactivity/i],
  ['Medical physics (chosen option)',/Medical physics/i]
 ],
 Chemistry:[
  ['Atomic structure',/Atomic structure|Ionisation energy/i],
  ['Amount of substance',/Amount of substance|Titration calculations|Back titrations|Empirical formula/i],
  ['Bonding',/Bonding|Shapes|Intermolecular forces/i],
  ['Energetics',/^Energetics$/i],
  ['Kinetics',/^Kinetics$/i],
  ['Equilibria and Kc',/Equilibria|Kc/i],
  ['Redox',/^Redox$/i],
  ['Thermodynamics',/Thermodynamics|Born.Haber|Entropy|Gibbs/i],
  ['Rate equations',/Rate equations|Arrhenius/i],
  ['Kp',/^Kp$/i],
  ['Electrode potentials',/Electrode potentials/i],
  ['Acids and bases',/Acids & bases|Weak acids|Buffers|Kw/i],
  ['Periodicity',/^Periodicity$/i],
  ['Group 2',/^Group 2$/i],
  ['Group 7',/^Group 7$/i],
  ['Period 3 elements and oxides',/Period 3/i],
  ['Transition metals',/Transition metals/i],
  ['Aqueous ions',/Aqueous ions/i],
  ['Introduction to organic chemistry',/^Organic chemistry$/i],
  ['Alkanes',/^Alkanes$/i],
  ['Halogenoalkanes',/^Halogenoalkanes$/i],
  ['Alkenes',/^Alkenes$/i],
  ['Alcohols',/^Alcohols$/i],
  ['Organic analysis',/^Organic analysis$|Organic analysis & synthesis/i],
  ['Optical isomerism',/Optical isomerism/i],
  ['Aldehydes and ketones',/Aldehydes and ketones/i],
  ['Carboxylic acids and derivatives',/Carboxylic acids|Esters|Acyl chlorides/i],
  ['Aromatic chemistry',/Aromatic chemistry/i],
  ['Amines',/^Amines$/i],
  ['Polymers',/Polymers/i],
  ['Amino acids, proteins and DNA',/Amino acids|DNA/i],
  ['Organic synthesis',/Organic synthesis/i],
  ['NMR',/^NMR$/i],
  ['Chromatography',/Chromatography/i]
 ],
 Maths:[
  ['Proof',/^Proof$/i],
  ['Algebra and functions',/Algebra|Functions|Quadratics|Binomial|Transformations/i],
  ['Coordinate geometry',/Coordinate geometry/i],
  ['Sequences and series',/Sequences/i],
  ['Trigonometry',/Trigonometry/i],
  ['Exponentials and logarithms',/Logarithms|Logs|Exponentials/i],
  ['Differentiation',/Differentiation/i],
  ['Integration',/Integration/i],
  ['Numerical methods',/Numerical methods/i],
  ['Vectors',/Vectors/i],
  ['Statistical sampling',/Sampling/i],
  ['Data presentation and interpretation',/Data presentation|Data interpretation/i],
  ['Probability',/Probability/i],
  ['Statistical distributions',/Statistical distributions|Binomial distribution|Normal distribution/i],
  ['Statistical hypothesis testing',/Hypothesis testing/i],
  ['Quantities and units in mechanics',/Quantities and units/i],
  ['Kinematics',/Kinematics/i],
  ["Forces and Newton's laws",/Forces|Newton/i],
  ['Moments',/Moments/i]
 ]
};
function renderSyllabusCoverage(){
 const el=document.getElementById('syllabusCoverage'),select=document.getElementById('specSubject');
 if(!el||!select)return;const sub=select.value;
 el.innerHTML=(AQA_SYLLABUS[sub]||[]).map(([name,re])=>{
  const nc=cards.filter(c=>c.subject===sub&&re.test(c.topic+' | '+(c.courseTopic||''))).length;
  const nq=examQuestions.filter(q=>q.subject===sub&&q.standalone!==false&&re.test(q.topic+' | '+(q.courseTopic||'')+' | '+(q.subtopic||''))).length;
  return '<div class="syllabus-row '+(!nc&&!nq?'missing':'')+'"><strong>'+esc(name)+'</strong><small>'+(nc||nq?nc+' cards · '+nq+' questions':'Not yet indexed')+'</small></div>';
 }).join('');
}
function renderProgress(){
 renderSyllabusCoverage();
 document.getElementById('subjectProgress').innerHTML=['Physics','Chemistry','Maths'].map(sub=>{const a=cards.filter(c=>c.active!==false&&c.subject===sub),started=a.filter(c=>state(c.id).stage>=0),mature=a.filter(c=>state(c.id).mastered).length,avg=started.length?Math.round(started.map(memoryHealth).reduce((x,y)=>x+y,0)/started.length*100):0,ts=Object.entries(profile.topicStats).filter(([k])=>k.startsWith(sub+'|')).map(([,v])=>v),em=ts.reduce((x,v)=>x+(v.examMarks||0),0),ex=ts.reduce((x,v)=>x+(v.examMax||0),0);return '<div class="progress-card"><div class="subject-progress-head"><span>'+sub+'</span><span>'+mature+' mature / '+a.length+'</span></div><div class="bar-track"><div class="bar-fill" style="width:'+(a.length?mature/a.length*100:0)+'%"></div></div><div class="progress-note">'+started.length+' started · predicted recall '+avg+'%'+(ex?' · exam '+em+'/'+ex:'')+'</div></div>'}).join('');
 const started=cards.filter(c=>state(c.id).stage>=0),avg=started.length?Math.round(started.map(memoryHealth).reduce((a,b)=>a+b,0)/started.length*100):0,long=started.filter(c=>state(c.id).stability>=90).length;document.getElementById('retentionCard').innerHTML='<h3>Retention model</h3><div class="schedule-row"><span>Average predicted recall</span><b>'+avg+'%</b></div><div class="schedule-row"><span>Cards stable for 3+ months</span><b>'+long+'</b></div><div class="schedule-row"><span>Recorded mistakes</span><b>'+profile.errorLog.length+'</b></div>'
}

function buy(kind,id){
 // Route destination purchases through a non-destructive, alias-aware operation.
 // A historical purchase of cape_town/addis_ababa/victoria_falls is already owned.
 if(kind==='location'){
  const destination=LOCATIONS.find(x=>x.id===id);
  if(!destination)return;
  const safety=window.RevisionWorldProfileSafety;
  if(!safety){showToast('Location purchases unavailable until the safety module loads');return}
  const outcome=safety.purchaseLocation(profile,destination);
  if(outcome.insufficientPoints){showToast('Not enough points yet');return}
  profile=outcome.profile;
  save();
  if(!outcome.alreadyOwned)showToast('Unlocked '+destination.name);
  // Centre the Earth on the newly owned/selected destination, keeping the
  // original pin coordinates unchanged. The pin is green once owned.
  focusOnGlobeLocation(destination.id,false);
  renderAll();drawGlobe();
  return;
 }
 let item,owned;
 if(kind==='character'){item=CHARACTERS.find(x=>x.id===id);owned=profile.shopOwned.characters}
 else if(kind==='outfit'){item=OUTFITS.find(x=>x.id===id);owned=profile.shopOwned.outfits}
 else {item=LOCATIONS.find(x=>x.id===id);owned=profile.shopOwned.locations}
 if(!item)return;
 if(owned.includes(id)){
   if(kind==='character'){profile.equippedCharacter=id;const ownFor=profile.shopOwned.outfits.find(x=>x.startsWith(id+'-'));profile.equippedOutfit=ownFor||id+'-default'}
   else if(kind==='outfit'){profile.equippedOutfit=id;profile.equippedCharacter=item.character}
   else profile.equippedLocation=id;
   save();renderAll();return;
 }
 if(profile.points<item.cost){showToast('Not enough points yet');return}
 profile.points-=item.cost;owned.push(id);
 if(kind==='character'){profile.equippedCharacter=id;const def=id+'-default';if(!profile.shopOwned.outfits.includes(def))profile.shopOwned.outfits.push(def);profile.equippedOutfit=def}
 else if(kind==='outfit'){profile.equippedOutfit=id;profile.equippedCharacter=item.character}
 else profile.equippedLocation=id;
 save();showToast('Unlocked '+item.name);renderAll();
}

function placeImage(el,url,location){
 if(!url||!el?.isConnected)return;
 const img=document.createElement('img');img.loading='lazy';img.alt='Photograph of '+location.name;img.referrerPolicy='no-referrer';
 el.replaceChildren(img);
 img.onerror=()=>{if(el.isConnected)el.textContent='Photo unavailable'};
 img.src=url;
}
const LOCATION_PHOTO_SEARCH={
 hongkong:'Hong Kong Victoria Harbour skyline panorama',
 singapore:'Singapore Marina Bay skyline photograph',
 bali:'Bali Indonesia rice terrace landscape',
 bohol:'Bohol Chocolate Hills landscape',coron:'Coron Palawan lagoon Philippines',
 peritomoreno:'Perito Moreno Glacier panorama',chefchaouen:'Chefchaouen Morocco blue city',
 papeete:'Papeete Tahiti harbour',apia:'Apia Samoa town',grandcanyon:'Grand Canyon South Rim panorama'
};
function locationImageFallback(el,location){
 if(el?.isConnected)el.textContent='Photographs unavailable';
}
async function locationPhoto(location,el){
 if(!location||!el?.isConnected)return;
 const gallery=window.RevisionWorldPhotoGallery;
 if(!gallery){el.textContent='Photographs unavailable';return}
 const load=()=>gallery.render(el,location,{card:!!el.closest('#locationShop')});
 if(typeof IntersectionObserver==='function'&&el.closest('#locationShop')){
  const io=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){io.disconnect();load()}
  },{rootMargin:'300px'});
  io.observe(el);
 }else await load();
}
function evenlySpacedLocations(locations){
 const regions=['Africa','Asia','Europe','North America','South America','Oceania'];
 const buckets=Object.fromEntries(regions.map(r=>[r,locations.filter(x=>x.region===r)]));
 const arr=[];
 let changed=true;
 while(changed){changed=false;for(const region of regions){if(buckets[region].length){arr.push(buckets[region].shift());changed=true}}}
 return arr.concat(locations.filter(x=>!regions.includes(x.region)));
}
function renderLocationGallery(){
 const selected=document.getElementById('locationRegion').value;
 const distinct=window.RevisionWorldProfileSafety?.distinctLocations(LOCATIONS)||LOCATIONS;
 const pool=selected?distinct.filter(l=>l.region===selected):evenlySpacedLocations(distinct);
 const visible=pool.slice(0,locationVisibleLimit);
 document.getElementById('regionCount').textContent=selected?pool.length+' places':distinct.length+' worldwide';
 document.getElementById('locationShop').innerHTML=visible.map(l=>{
  const owned=window.RevisionWorldProfileSafety?.isOwnedLocation(profile,l.id)??profile.shopOwned.locations.includes(l.id);
  return '<div class="shop-item location-card"><div class="location-photo" data-location-photo="'+esc(l.id)+'">Loading photograph…</div>'+
   '<div class="location-body"><b>'+esc(l.name)+'</b><small class="region-tag">'+esc(l.region||'Global')+'</small>'+
   '<button class="'+(!owned?'buy':'')+'" data-location="'+esc(l.id)+'" '+(!owned&&profile.points<l.cost?'disabled':'')+'>'+
   (owned?((window.RevisionWorldProfileSafety?.family(l.id)||[l.id]).includes(profile.equippedLocation)?'Active location':'Use location'):l.cost+' points')+'</button></div></div>';
 }).join('');
 document.querySelectorAll('[data-location]').forEach(b=>b.onclick=()=>buy('location',b.dataset.location));
 document.querySelectorAll('[data-location-photo]').forEach(el=>locationPhoto(LOCATIONS.find(l=>l.id===el.dataset.locationPhoto),el));
 const more=document.getElementById('moreLocations');
 more.classList.toggle('hidden',visible.length>=pool.length);
 more.textContent='Show more places ('+visible.length+' / '+pool.length+')';
}
const REGION_CULTURE={
 'Asia':'Local traditions, food and languages vary greatly across this region, from ancient cities to modern centres.',
 'Europe':'The cityscape, cuisine and festivals reflect different European languages and regional histories.',
 'Africa':'Regional languages, cuisines, arts and traditions differ greatly between communities and countries.',
 'North America':'Explore the local mix of histories, food, music and cultural traditions in the surrounding area.',
 'South America':'Local food, music and architecture reflect varied Indigenous and other historical influences.',
 'Oceania':'Explore the distinctive Indigenous, Pacific Island and contemporary cultures of the region.'
};
const LOCATION_FACTS={
 london:'The River Thames passes through the centre of London.',
 singapore:'Singapore is both a city and an independent country.',
 hongkong:'Victoria Harbour separates Hong Kong Island from the Kowloon Peninsula.',
 bali:'Bali is an Indonesian island with a distinctive Hindu cultural heritage.',
 tokyo:'Tokyo is the capital of Japan.',
 sydney:'Sydney Harbour contains the Sydney Opera House and the Harbour Bridge.',
 capetown:'Table Mountain overlooks Cape Town.',
 rio:'Rio de Janeiro is famous for its Carnival celebrations.',
 nairobi:'Nairobi is the capital of Kenya.',
 cusco:'Cusco was an important capital of the Inca Empire.',
 machupicchu:'Machu Picchu is an Inca archaeological site high in the Andes.',
 paris:'The Eiffel Tower was constructed for the 1889 Exposition Universelle.',
 rome:'The Colosseum dates from the Roman Empire.',
 edinburgh:'Edinburgh hosts an internationally known annual arts festival.',
 newyork:'New York City contains five boroughs.',
 queenstown:'Queenstown sits beside Lake Wakatipu on New Zealand’s South Island.',
 petra:'Petra is known for architecture carved into sandstone cliffs.',
 reykjavik:'Reykjavík is the capital of Iceland.',
 porto:'Porto\'s historic centre overlooks the Douro, a river associated with the region\'s wine trade.',
 granada:'Granada is home to the Alhambra palace complex.',
 seville:'Seville\'s cathedral is among the largest Gothic churches in the world.',
 valencia:'Valencia hosts the Las Fallas festival, known for large artistic sculptures.',
 florence:'Florence\'s historic centre is a UNESCO World Heritage Site.',
 krakow:'Kraków\'s medieval Old Town includes the Rynek Główny market square.',
 tallinn:'Tallinn has one of northern Europe\'s best-preserved medieval old towns.',
 riga:'Riga is renowned for its Art Nouveau architecture.',
 vilnius:'Vilnius is known for a large historic Baroque old town.',
 salzburg:'Salzburg is associated with Mozart and the Salzburg Festival.',
 sarajevo:'Sarajevo hosted the 1984 Winter Olympic Games.',
 mostar:'The Stari Most bridge crosses the River Neretva.',
 kotor:'Kotor\'s old town sits within the dramatic Bay of Kotor.',
 casablanca:'Casablanca is Morocco\'s largest city and a major Atlantic port.',
 essaouira:'Essaouira is known for its Atlantic-facing medina and fishing harbour.',
 aswan:'Aswan stands beside the Nile in southern Egypt.',
 sidi_bou_said:'Sidi Bou Said is known for its white buildings with blue doors.',
 cape_coast:'Cape Coast is home to a historic castle on Ghana\'s Atlantic coast.',
 cape_town:'Cape Town lies beneath Table Mountain near the Atlantic and Indian Ocean region.',
 stellenbosch:'Stellenbosch is noted for its university and Cape Dutch architecture.',
 windhoek:'Windhoek is Namibia\'s capital and lies on the central plateau.',
 swakopmund:'Swakopmund is a coastal town between Namibia\'s desert and the Atlantic.',
 stone_town:'Stone Town is the historic heart of Zanzibar City and a UNESCO World Heritage Site.',
 arusha:'Arusha is a gateway to northern Tanzania\'s safari parks.',
 kampala:'Kampala is Uganda\'s capital on hills near Lake Victoria.',
 mombasa:'Mombasa is a historic Kenyan coastal city on the Indian Ocean.',
 victoria_falls:'Victoria Falls is on the Zambezi River between Zambia and Zimbabwe.',
 nosy_be:'Nosy Be is an island off north-western Madagascar.',
 addis_ababa:'Addis Ababa hosts the headquarters of the African Union.',
 mount_cook:'Aoraki / Mount Cook is the highest mountain in New Zealand.'
};
const LOCATION_CULTURE_DETAILS={
 "tbilisi": "Sulphur-bath houses and carved wooden balconies are distinctive features of old Tbilisi; Georgian food includes khinkali dumplings and khachapuri.",
 "seoul": "Explore traditional hanok houses, royal palaces and markets; Korean food culture includes kimchi, barbecue and communal side dishes.",
 "busan": "Busan's fishing traditions can be seen at Jagalchi Market, while its coast has beaches and hillside neighbourhoods.",
 "shanghai": "The Bund preserves grand riverside buildings, while the former French Concession has tree-lined streets and shikumen-style lanes.",
 "beijing": "Beijing's hutong alleyways, courtyards and imperial sites give the city a distinct historical character.",
 "manila": "Intramuros preserves part of Manila's Spanish-colonial history, alongside a lively contemporary Filipino food and arts scene.",
 "bohol": "Bohol is known for the Chocolate Hills and villages around the Loboc River; local traditions are connected to island life.",
 "coron": "Coron is associated with the Calamian Islands' limestone cliffs, clear-water lagoons and local Tagbanwa heritage.",
 "hanoi": "Hanoi's Old Quarter has long been organised around crafts and trades; its street-food culture includes phở and bún chả.",
 "hochiminh": "Ho Chi Minh City's streets combine historic markets, cafés and architecture reflecting several periods of Vietnamese history.",
 "bangkok": "Bangkok's temples, canal history and lively street-food areas sit alongside the Chao Phraya River.",
 "kualalumpur": "Kuala Lumpur blends Malay, Chinese and Indian influences in its markets, food and religious buildings.",
 "almaty": "The city lies below the Trans-Ili Alatau mountains, and Kazakh cultural life includes music, bazaars and hospitality traditions.",
 "bishkek": "Bishkek's parks and tree-lined boulevards contrast with the nearby Tian Shan mountains and Kyrgyz nomadic traditions.",
 "samarkand": "Timurid-era tiled monuments surround Registan Square, reflecting Samarkand's long importance on Silk Road trade routes.",
 "kyoto": "Kyoto is closely associated with Buddhist temples, traditional gardens, seasonal festivals and crafts such as textile-making.",
 "gyeongju": "Gyeongju was the capital of the Silla kingdom and has royal tombs, Buddhist sites and major archaeological remains.",
 "taipei": "Taipei's night markets, tea culture and temples are prominent parts of everyday life.",
 "dubai": "Traditional trading neighbourhoods around Dubai Creek contrast with newer developments; the city has strong maritime trading roots.",
 "istanbul": "Istanbul's bazaars, mosques and Byzantine heritage reflect its history as a major city between Europe and Asia.",
 "venice": "Venice is built around canals and islands; its glassmaking traditions are associated with nearby Murano.",
 "dublin": "Dublin has a strong literary and music culture, with historic Georgian streets and a long history of theatre.",
 "barcelona": "Modernisme architecture, including work by Antoni Gaudí, is part of Barcelona's distinctive urban identity.",
 "lisbon": "Lisbon is associated with azulejo tiles, traditional trams, fado music and neighbourhoods on steep hillsides.",
 "amsterdam": "Amsterdam's canal-ring architecture and narrow houses reflect its seventeenth-century mercantile history.",
 "prague": "Prague's Old Town, bridges and castle preserve architecture from several European historical periods.",
 "vienna": "Vienna is known for concert music, coffeehouse traditions and buildings connected to the Habsburg era.",
 "athens": "Athens has archaeological sites linked to classical Greece, alongside modern neighbourhood markets and cafés.",
 "marrakech": "Marrakesh's medina contains souks and riads, while Jemaa el-Fnaa is well known for its busy public square.",
 "fes": "Fes el Bali retains historic lanes, craft workshops and madrasas associated with traditional Moroccan urban life.",
 "cairo": "Cairo combines historic Islamic architecture, bustling markets and the Nile; nearby Giza is associated with the ancient pyramids.",
 "luxor": "Luxor lies by the Nile amid ancient temples and royal tombs connected with Thebes.",
 "alexandria": "Alexandria has a Mediterranean maritime identity and a history linked to Hellenistic and later Egyptian cultures.",
 "budapest": "Thermal baths, Danube riverfront architecture and historic cafés help characterise Budapest.",
 "florence": "Florence's Renaissance-era art and buildings are closely linked to historical craft, painting and architecture.",
 "stockholm": "Stockholm is built across islands; Gamla stan preserves a historic core and Nordic design is prominent.",
 "vancouver": "Vancouver is framed by coastal mountains and the Pacific; the region has rich Coast Salish Indigenous cultural heritage.",
 "queenstown": "Queenstown sits on Lake Wakatipu and is closely associated with nearby alpine scenery and outdoor recreation.",
 "rio": "Rio's samba and Carnival traditions are closely tied to local neighbourhoods and music communities.",
 "nairobi": "Nairobi is a major centre for Kenyan arts, literature and commerce, near a national park.",
 "singapore": "Singapore's hawker centres bring together dishes influenced by Chinese, Malay, Indian and other culinary traditions.",
 "hongkong": "Hong Kong's Cantonese food, maritime history and densely built neighbourhoods are part of its urban character.",
 "bali": "Balinese Hindu temples, dance and traditional arts are strongly associated with the island's community life.",
 "paris": "Paris has longstanding associations with galleries, literature, cafés and architecture along the Seine.",
 "london": "London's museums, theatres and diverse neighbourhoods reflect the city's layered history and communities.",
 "tokyo": "Tokyo ranges from older districts such as Asakusa to modern districts; festivals, food and design traditions vary by neighbourhood."
};
const LOCATION_LOCAL_OVERVIEWS={
  "london": "London stands on the River Thames in south-east England and is the UK's capital. River crossings, docks and railways shaped its growth from Roman Londinium into a major international city. Westminster, the historic City and many other neighbourhoods reflect different stages of that history.",
  "busan": "Busan is a major port on South Korea's south-eastern coast, facing the Korea Strait. Hills, beaches and waterfront neighbourhoods create a different setting from Seoul. Its harbour, markets and rail connections reflect its importance to trade and contemporary Korean culture.",
  "tbilisi": "Tbilisi, Georgia's capital, extends along the Mtkvari River between surrounding hills. Its old streets, sulphur-bath district and Narikala area show layers of Georgian and wider regional history, while newer districts and bridges reflect a changing city.",
  "nairobi": "Nairobi is Kenya's capital, located in the East African highlands. It grew as a railway and administrative centre and is now a major commercial city. Nearby Nairobi National Park makes the relationship between urban development and wildlife especially visible.",
  "newyork": "New York City lies where the Hudson River reaches the Atlantic, with five boroughs connected by bridges, tunnels and ferries. Its harbour helped it become a centre for migration, trade and culture. Manhattan's skyline is only one part of its varied neighbourhoods.",
  "cusco": "Cusco lies high in the Peruvian Andes and was a centre of the Inca Empire. Streets preserve examples of Inca stonework alongside later Spanish colonial buildings. The surrounding valleys and mountain routes are essential to understanding the city's historic role.",
  "sydney": "Sydney sits around Port Jackson on Australia's east coast. This area has long been Country for Aboriginal peoples, including Gadigal communities. The natural harbour, transport network and expanding suburbs matter as much to the modern city as the Opera House and Harbour Bridge.",
  "capetown": "Cape Town occupies a coastal setting beneath Table Mountain in South Africa. Mountain, ocean and port shaped its growth. The city's history includes colonial settlement, forced displacement and apartheid; its diverse communities continue to shape its identity.",
  "tokyo": "Tokyo grew from the former city of Edo on the Pacific side of Honshu. Extensive railway networks connect residential neighbourhoods, business districts, parks and historic sites. Its geography includes bayside land and inland suburbs, not just the familiar skyscrapers.",
  "reykjavik": "Reykjavík is Iceland's capital on the south-west coast, overlooking Faxaflói Bay. Its waterfront reflects a history of fishing and trade, while nearby volcanic landscapes and geothermal energy are important parts of the region's geography and modern infrastructure.",
  "seoul": "Seoul, South Korea's capital, occupies the Han River valley amid surrounding mountains. Palaces and older neighbourhoods stand beside dense modern districts. Bridges and its extensive metro system connect the metropolitan area across the river.",
  "singapore": "Singapore is a city-state at the southern end of the Malay Peninsula. Its harbour and position on important maritime routes helped it grow as a trading hub. Gardens, public housing and historic neighbourhoods illustrate how city planning responds to migration and limited land."
};
async function setLocationInfo(id){
 if(openLocationId===id){
  openLocationId=null;
  document.getElementById('globeLocationInfo').classList.add('hidden');
  drawGlobe();return;
 }
 const location=LOCATIONS.find(place=>place.id===id),host=document.getElementById('globeLocationInfo');
 if(!location)return;
 if(!(window.RevisionWorldProfileSafety?.isOwnedLocation(profile,id)??profile.shopOwned.locations.includes(id))){
  showToast('Unlock '+location.name+' to explore its details');return;
 }
 openLocationId=id;selectedLocation=id;
 host.classList.remove('hidden');
 host.setAttribute('role','region');
 host.setAttribute('aria-label',location.name+' unlocked location details');
 const isFeature=!!location.worldKind;
 const offlineGuide=window.RevisionWorldOfflineCityGuides?.[id];
 // One destination guide only. Cities have their own text; new country and
 // sea/ocean pins receive their longer article from the read-only story module.
 host.innerHTML='<div class="globe-info-top"><div class="globe-place-heading"><span class="globe-owned-pill">✓ Unlocked location</span><h3>'+esc(location.name)+'</h3><span class="globe-place-meta">'+esc(location.region||'World')+'</span></div><button id="closeLocationInfo" type="button" aria-label="Close location information">Close</button></div>'+
  '<div class="detail-media"><div id="detailPhotoOne" class="image-fallback"></div></div>'+
  (isFeature?'':'<div class="location-background"><h4>About '+esc(location.name)+'</h4><p id="locationOverview">'+esc(LOCATION_LOCAL_OVERVIEWS[id]||offlineGuide?.overview||'Loading a local introduction…')+'</p></div>'+
   '<div class="location-background"><h4>Culture and history</h4><p id="locationCulture">'+esc(LOCATION_CULTURE_DETAILS[id]||offlineGuide?.culture||'Loading location-specific background…')+'</p></div>'+
   '<div class="location-background"><h4>Quick fact</h4><p id="locationQuickFact">'+esc(LOCATION_FACTS[id]||offlineGuide?.fact||'Finding a distinctive fact…')+'</p></div>');
 document.getElementById('closeLocationInfo').onclick=()=>setLocationInfo(id);
 locationPhoto(location,document.getElementById('detailPhotoOne'));
 if(isFeature){drawGlobe();return}
 if(!LOCATION_LOCAL_OVERVIEWS[id]&&!offlineGuide?.overview)try{
  const url='https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=1&exchars=1700&format=json&formatversion=2&origin=*&titles='+encodeURIComponent(location.wiki.replace(/_/g,' '));
  const response=await fetch(url,{cache:'force-cache'});
  if(!response.ok)throw Error('Location introduction unavailable');
  const pages=(await response.json()).query?.pages||[];
  const extract=String(pages[0]?.extract||'').replace(/\s+/g,' ').trim();
  if(!extract)throw Error('No summary returned');
  if(openLocationId===id&&host.isConnected){
   const sentences=extract.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(t=>t.trim()).filter(Boolean)||[extract];
   const first=LOCATION_FACTS[id]?0:1;
   document.getElementById('locationOverview').textContent=(sentences.slice(first,first+5).join(' ')||extract).slice(0,900);
   if(!LOCATION_CULTURE_DETAILS[id])
    document.getElementById('locationCulture').textContent=sentences.slice(first+5,first+10).join(' ').slice(0,650)||'Further local history is unavailable.';
   if(!LOCATION_FACTS[id])
    document.getElementById('locationQuickFact').textContent=(sentences[0]||'').slice(0,300)||'A distinctive local fact is not yet available.';
  }
 }catch{
  if(openLocationId===id&&host.isConnected){
   document.getElementById('locationOverview').textContent=LOCATION_FACTS[id]||'Location information is temporarily unavailable.';
   if(!LOCATION_CULTURE_DETAILS[id])document.getElementById('locationCulture').textContent='Further local history is unavailable offline.';
   if(!LOCATION_FACTS[id])document.getElementById('locationQuickFact').textContent='A local fact is not yet available.';
  }
 }
 drawGlobe();
}
function renderShop(){
 const oc=profile.shopOwned.characters,oo=profile.shopOwned.outfits,ol=profile.shopOwned.locations,curr=profile.equippedCharacter;
 const seriesSel=document.getElementById('characterSeries'),ownedSel=document.getElementById('characterOwnedFilter');
 const series=[...new Set(CHARACTERS.map(c=>c.series))];
 const oldSeries=seriesSel.value;
 seriesSel.innerHTML='<option value="">All series</option>'+series.map(x=>'<option>'+esc(x)+'</option>').join('');
 if(series.includes(oldSeries))seriesSel.value=oldSeries;
 const seriesFilter=seriesSel.value,ownedFilter=ownedSel.value;
 const allVisibleChars=CHARACTERS.filter(c=>(!seriesFilter||c.series===seriesFilter)&&(ownedFilter==='all'||(ownedFilter==='owned'&&oc.includes(c.id))||(ownedFilter==='locked'&&!oc.includes(c.id))));const visibleChars=allVisibleChars.slice(0,characterVisibleLimit);
 document.getElementById('characterCount').textContent=oc.length+' / '+CHARACTERS.length+' unlocked';
 document.getElementById('outfitCount').textContent=oo.length+' / '+OUTFITS.length+' unlocked';
 const uniqueLocations=window.RevisionWorldProfileSafety?.distinctLocations(LOCATIONS)||LOCATIONS;
 document.getElementById('locationCount').textContent=uniqueLocations.filter(l=>window.RevisionWorldProfileSafety?.isOwnedLocation(profile,l.id)??ol.includes(l.id)).length+' / '+uniqueLocations.length+' unlocked';
 document.getElementById('characterShop').innerHTML=visibleChars.map(c=>{const def=OUTFITS.find(o=>o.id===c.id+'-default');return '<div class="shop-item character-card '+(curr===c.id?'active-character':'')+'"><div class="shop-icon">'+characterArtwork(c,def)+'</div><b>'+esc(c.name)+'</b><small>'+esc(c.series)+'</small><button class="'+(!oc.includes(c.id)?'buy':'')+'" data-character="'+c.id+'" '+(!oc.includes(c.id)&&profile.points<c.cost?'disabled':'')+'>'+(oc.includes(c.id)?(curr===c.id?'Selected':'Select'):c.cost+' points')+'</button></div>'}).join('');
 const outfits=OUTFITS.filter(o=>o.character===curr),ch=CHARACTERS.find(c=>c.id===curr)||CHARACTERS[0];
 document.getElementById('outfitHeading').textContent='Outfits for '+ch.name;
 document.getElementById('outfitCount').textContent=outfits.filter(o=>oo.includes(o.id)).length+' / '+outfits.length+' for '+ch.name;
 document.getElementById('outfitShop').innerHTML=outfits.map(o=>'<div class="shop-item outfit-card"><div class="shop-icon">'+characterArtwork(ch,o)+'</div><b>'+esc(o.name)+'</b><small>'+esc(ch.name)+' · '+esc(ch.series)+'</small><button class="'+(!oo.includes(o.id)?'buy':'')+'" data-outfit="'+o.id+'" '+(!oo.includes(o.id)&&profile.points<o.cost?'disabled':'')+'>'+(oo.includes(o.id)?(profile.equippedOutfit===o.id?'Equipped':'Equip'):o.cost+' points')+'</button>'+'<div class="outfit-image-tools"><label class="outfit-upload">Choose image<input type="file" data-outfit-upload="'+esc(o.id)+'" accept="image/jpeg,image/png,image/webp" aria-label="Choose personal image for '+esc(o.name)+'"></label><button type="button" data-outfit-clear="'+esc(o.id)+'" class="outfit-clear">Reset image</button></div></div>').join('');
 document.querySelectorAll('[data-character]').forEach(b=>b.onclick=()=>buy('character',b.dataset.character));
 document.querySelectorAll('[data-outfit]').forEach(b=>b.onclick=()=>buy('outfit',b.dataset.outfit));
 document.querySelectorAll('[data-outfit-upload]').forEach(input=>input.onchange=async()=>{
  const file=input.files?.[0],id=input.dataset.outfitUpload;if(!file||!OUTFITS.some(x=>x.id===id))return;
  input.disabled=true;
  try{
   const data=await compressOutfitPhoto(file);
   await setSavedOutfitImage(id,data);
   renderShop();
   renderAvatar();
  }catch(error){
   window.alert(error.message||'Could not store the outfit image.');
   input.disabled=false;
  }
 });
 document.querySelectorAll('[data-outfit-clear]').forEach(button=>button.onclick=async()=>{
  const id=button.dataset.outfitClear;if(!OUTFITS.some(x=>x.id===id))return;
  button.disabled=true;
  try{await setSavedOutfitImage(id,null);renderShop();renderAvatar()}
  catch(error){window.alert(error.message||'Could not clear this outfit image.');button.disabled=false}
 });

 loadCharacterArt(document.getElementById('characterShop'));
 loadCharacterArt(document.getElementById('outfitShop'));
 const more=document.getElementById('moreCharacters');more.classList.toggle('hidden',visibleChars.length>=allVisibleChars.length);
 more.textContent='Show more characters ('+visibleChars.length+' of '+allVisibleChars.length+')';loadCharacterArt(document.getElementById('characterShop'));loadCharacterArt(document.getElementById('outfitShop'));
 renderLocationGallery();
 drawGlobe();
}
function project(lat,lon,w,h){const la=lat*Math.PI/180,lo=(lon-globeLon)*Math.PI/180,cl=globeLat*Math.PI/180,x=Math.cos(la)*Math.sin(lo),y=Math.sin(la)*Math.cos(cl)-Math.cos(la)*Math.cos(lo)*Math.sin(cl),z=Math.sin(la)*Math.sin(cl)+Math.cos(la)*Math.cos(lo)*Math.cos(cl);const R=Math.min(w,h)*.4;return {x:w/2+x*R,y:h/2-y*R,z}}
function visibleGlobePins(w,h,region=''){
 const distinct=window.RevisionWorldProfileSafety?.distinctLocations(LOCATIONS)||LOCATIONS;
 const all=distinct.filter(l=>!region||l.region===region)
   .map(l=>({location:l,p:project(l.lat,l.lon,w,h),
      owned:window.RevisionWorldProfileSafety?.isOwnedLocation(profile,l.id)??profile.shopOwned.locations.includes(l.id)}))
   .filter(item=>item.p.z>0.001);
 // True coordinates never move: decluttering only affects which exact pins render.
 const expanded=document.getElementById('showAllGlobePins')?.checked===true;
 if(expanded)return all.sort((a,b)=>Number(a.owned)-Number(b.owned));
 const score=item=>(item.location.id===openLocationId?1000:0)
   +(item.owned?600:0)
   +(item.location.worldKind==='country'?90:item.location.worldKind==='sea'||item.location.worldKind==='ocean'?8:200)
   +item.p.z*40;
 const queue=all.sort((a,b)=>score(b)-score(a));
 const shown=[],distance=15*(w/700); // same visual spacing at higher rendering resolution
 for(const item of queue){
  if(shown.every(other=>Math.hypot(item.p.x-other.p.x,item.p.y-other.p.y)>distance)){
    shown.push(item);
  }
 }
 return shown.sort((a,b)=>Number(a.owned)-Number(b.owned));
}
function drawGlobe(){
 const c=document.getElementById('globe');if(!c)return;
 // Paint twice as many intrinsic pixels as the 700×360 CSS presentation.
 // Pin coordinates use this same canvas space; no geographic coordinates move.
 if(c.width!==1400||c.height!==720){c.width=1400;c.height=720}
 const ctx=c.getContext('2d'),w=c.width,h=c.height,R=Math.min(w,h)*.4,cx=w/2,cy=h/2;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#020617';ctx.fillRect(0,0,w,h);
 if(earthTextureReady&&earthPixels){
   const img=ctx.createImageData(w,h),out=img.data,lon0=globeLon*Math.PI/180,lat0=globeLat*Math.PI/180;
   const cosLat0=Math.cos(lat0),sinLat0=Math.sin(lat0);
   const minX=Math.max(0,Math.floor(cx-R)),maxX=Math.min(w-1,Math.ceil(cx+R)),minY=Math.max(0,Math.floor(cy-R)),maxY=Math.min(h-1,Math.ceil(cy+R));
   for(let py=minY;py<=maxY;py+=1){
     const yy=-(py-cy)/R;
     for(let px=minX;px<=maxX;px+=1){
       const xx=(px-cx)/R,r2=xx*xx+yy*yy;if(r2>1)continue;
       const z=Math.sqrt(1-r2);
       const lat=Math.asin(yy*cosLat0+z*sinLat0);
       const lon=lon0+Math.atan2(xx,z*cosLat0-yy*sinLat0);
       let u=((lon/(2*Math.PI)+.5)%1+1)%1,v=.5-lat/Math.PI;
       // Bilinear sample rather than nearest-neighbour: eliminates isolated
       // saturated green pixels and jagged seams when the Earth rotates.
       const tx=u*(earthW-1),ty=Math.min(earthH-1,Math.max(0,v*(earthH-1)));
       const x0=Math.floor(tx),y0=Math.floor(ty),x1=Math.min(earthW-1,x0+1),y1=Math.min(earthH-1,y0+1);
       const fx=tx-x0,fy=ty-y0,di=(py*w+px)*4;
       const a00=(y0*earthW+x0)*4,a10=(y0*earthW+x1)*4,a01=(y1*earthW+x0)*4,a11=(y1*earthW+x1)*4;
       const light=.58+.42*Math.max(0,z+.15*xx-.15*yy);
       const r=(earthPixels[a00]*(1-fx)+earthPixels[a10]*fx)*(1-fy)+(earthPixels[a01]*(1-fx)+earthPixels[a11]*fx)*fy;
       const g=(earthPixels[a00+1]*(1-fx)+earthPixels[a10+1]*fx)*(1-fy)+(earthPixels[a01+1]*(1-fx)+earthPixels[a11+1]*fx)*fy;
       const b=(earthPixels[a00+2]*(1-fx)+earthPixels[a10+2]*fx)*(1-fy)+(earthPixels[a01+2]*(1-fx)+earthPixels[a11+2]*fx)*fy;
       out[di]=r*light;out[di+1]=g*light;out[di+2]=b*light;out[di+3]=255;
     }
   }
   ctx.putImageData(img,0,0);
 }else{
   const g=ctx.createRadialGradient(cx-R*.3,cy-R*.3,R*.08,cx,cy,R);g.addColorStop(0,'#60a5fa');g.addColorStop(.55,'#2563eb');g.addColorStop(1,'#0f172a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();
 }
 ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
 const regionFilter=document.getElementById('locationRegion')?.value||'';
 for(const {location:l,p,owned} of visibleGlobePins(w,h,regionFilter)){
 const active=l.id===openLocationId;
 const scale=w/700;
 const radius=(active?6.2:owned?5.4:3.2)*scale;
 ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);
 ctx.fillStyle=active?'#fbbf24':owned?'#22c55e':'rgba(219,239,255,.7)';ctx.fill();
 ctx.lineWidth=(owned?1.9:0.8)*scale;ctx.strokeStyle=owned?'#eaffea':'rgba(20,51,74,.6)';ctx.stroke();
 if(active){ctx.beginPath();ctx.arc(p.x,p.y,10*scale,0,Math.PI*2);ctx.strokeStyle='#fde68a';ctx.lineWidth=2.1;ctx.stroke()}
 }
 document.getElementById('globeLabel').textContent='Drag to rotate · green = unlocked · pale = locked · gold = selected · tap a green pin for details';
}
function focusOnGlobeLocation(id,open=false){
 const place=LOCATIONS.find(l=>l.id===id);
 if(!place)return false;
 globeLon=place.lon;
 globeLat=clamp(place.lat,-65,65);
 const selector=document.getElementById('locationRegion');
 if(selector&&selector.value&&selector.value!==place.region){
   selector.value='';
   // Don't alter ownership or saved shop data when adjusting the filter.
   renderLocationGallery();
 }
 drawGlobe();
 if(open){
   const owned=window.RevisionWorldProfileSafety?.isOwnedLocation(profile,id)??profile.shopOwned.locations.includes(id);
   if(owned){
     if(openLocationId===id){openLocationId=null;document.getElementById('globeLocationInfo')?.classList.add('hidden')}
     setLocationInfo(id);
   }else showToast('Unlock '+place.name+' to read its location guide');
 }
 return true;
}
function globePointer(e){const c=document.getElementById('globe'),r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;return {x,y}}
function nearestPin(x,y){const canvas=document.getElementById('globe');let best=null,dist=14*(canvas.width/700);const region=document.getElementById('locationRegion').value;for(const item of visibleGlobePins(canvas.width,canvas.height,region)){const d=Math.hypot(item.p.x-x,item.p.y-y);if(d<dist){dist=d;best=item.location}}return best}

function renderAll(){renderLevel();renderStats();renderAvatar();renderChallenge();renderStudyType();renderSessionBanner();renderStudy();renderWeak();renderProgress();if(document.getElementById('shop').classList.contains('active'))renderShop()}
async function sync(manual=false){
 try{
 const [dr,er,xr,cr,...extraResponses]=await Promise.all([
  fetch(DECK_URL+'?v='+Date.now(),{cache:'no-store'}),
  fetch(EXAM_URL+'?v='+Date.now(),{cache:'no-store'}),
  fetch(EXAM_SUPPLEMENT_URL+'?v='+Date.now(),{cache:'no-store'}).catch(()=>null),
  fetch(EXAM_CORRECTIONS_URL+'?v='+Date.now(),{cache:'no-store'}).catch(()=>null),
  ...EXTRA_PRACTICE_URLS.map(url=>fetch(url+'?v='+Date.now(),{cache:'no-store'}).catch(()=>null))
 ]);
 if(!dr.ok||!er.ok)throw new Error('Main question bank unavailable');
 const d=await dr.json(),e=await er.json(),x=xr?.ok?await xr.json():{questions:[]},corrections=cr?.ok?await cr.json():{modelAnswers:{}},old=deckVersion;
 const extraBanks=await Promise.all(extraResponses.map(async res=>res?.ok?await res.json():{questions:[]}));
 cards=applyV238MolecularIonClarity(applyV237ChemBondAngleClarity(applyV219TofCorrections(applyV217LegacyChemistryCorrections((d.cards||[]).filter(c=>c.active!==false)))));
 applyV220IonTestCorrections(cards);
 applyV221RpCorrections(cards);
 // Map only the 110 individually reviewed legacy core cards to their AQA subsections.
 applyV287LegacySpecRefs(cards);
 applyV288LegacyChemBondingSpecRefs(cards);
 applyV289LegacyEnergeticsSpecRefs(cards);
 applyV290LegacyElectricitySpecRefs(cards);
 applyV314CoreMockQuality(cards);
 applyV315CoreRecallCalibration(cards);
 applyV316CoreRecallCalibration(cards);
 applyV321CoreRecallCalibration(cards);
 applyV322CoreRecallCalibration(cards);
 applyV324CoreRecallCalibration(cards);
 applyV326CoreClarityFixes(cards);
 applyV327CoreRecallCalibration(cards);
 applyV328ScienceCoreCalibration(cards);
 applyV329MathsCorePrecision(cards);
 applyV330ScienceCoreCalibration(cards);
 applyV331CoreAnswerCalibration(cards);
 applyV332GibbsBoundaryCorrection(cards);
 applyV343ScienceCorePrecision(cards);
 // Optional, single-fact recall cards. Missing supplements must not stop the core deck loading.
 const extraFlashBanks=await Promise.all(EXTRA_FLASHCARD_URLS.map(async url=>{
  try{const res=await fetch(url+'?v='+Date.now(),{cache:'no-store'});return res.ok?await res.json():{cards:[]}}
  catch{return {cards:[]}}
 }));
 const knownFlashIds=new Set(cards.map(c=>c.id));
 for(const [index,bank] of extraFlashBanks.entries())for(const c of (bank.cards||[])){
  if(!c||typeof c.id!=='string'||knownFlashIds.has(c.id)||c.active===false)continue;
  // Maths supplements are indices 0, 1 and 3; Physics is 4, 6 and 8; Chemistry is 2, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16 and 17; Physics also indices 18, 19 and 20; Chemistry index 21; Year 1 Pure Maths index 22.
  if(index<2){
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===2){
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===3){
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===4){
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===5){
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===6){
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===7){
   if(c.subject!=='Chemistry'||!['AS','A2'].includes(c.stage)||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===8){
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===9){
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===10){
   if(c.subject!=='Chemistry'||!['AS','A2'].includes(c.stage)||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===11){
   // v210 rate/Kp cards were fetched but silently discarded before v215.
   if(c.subject!=='Chemistry'||c.stage!=='A2'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===12){
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===13){
   // v218: only AS, taught and mock-eligible Chemistry measurement recall.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===14){
   // v219: only taught AS Chemistry TOF mock recall.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===15){
   // v220: retain school mock boundaries for AS Chemistry ion-test recall.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===16){
   // v221: AS Chemistry RP1–RP3 evaluation and uncertainty recall.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===17){
   // v222: taught AS Chemistry RP5/RP6 conceptual mock recall only.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===18){
   // v225: Year 1 Physics Waves, cladding and optical fibre recall.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===19){
   // v226: AS Physics interference, diffraction and stationary waves only.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===20){
   // v227: AS Physics mock reinforcement across taught Year 1 core topics.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===21){
   // v227: AS plus explicitly taught A2 Chemistry through Kp and taught organic.
   if(c.subject!=='Chemistry'||!['AS','A2'].includes(c.stage)||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===22){
   // v227: first school Maths mock, Year 1 Pure only.
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===23){
   // v229: taught AQA AS Waves mock recall only; block out-of-scope entries.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===24){
   // v230: only taught AQA Year 1 Physics Mechanics and Materials recall in mock.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===25){
   // v231: restrict supplemental Electricity recall to taught Year 1 AS Physics mock.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===26){
   // v232: only first Year 1 Pure Maths mock (no Year 2 functions, Statistics or Mechanics).
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===27){
   // v237: AS Chemistry bonding and crystal representation only.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===28){
   // v238: AQA AS atomic structure, TOF and ionisation mock application recall.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock')continue;
  }else if(index===29){
   // v239: Only AS taught/mock amount-of-substance applications may be loaded.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!/^3\.1\.2\.[1-5]$/.test(c.specRef||''))continue;
  }else if(index===30){
   // v243: Only AS taught/mock particle and radiation application flashcards.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!/^3\.2\.(?:1\.[1-7]|2\.[1-4])$/.test(c.specRef||''))continue;
  }else if(index===31){
   // v245: only the FIRST Year 1 Pure Maths mock, not any Year 2/Mechanics/Statistics.
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!['3.2','3.3','3.5','3.9','3.11'].includes(c.specRef))continue;
  }else if(index===32){
   // v246: 3.4 circle geometry applications from the first Year 1 Pure mock only.
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.specRef!=='3.4')continue;
  }else if(index===33){
   // v247: AS Chemistry Energetics applications from the taught mock only.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!/^3\.1\.4\.[1-4]$/.test(c.specRef||''))continue;
  }else if(index===34){
   // v248: AQA AS Physics Measurements 3.1: tested calculations and error-bar recall.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!/^3\.1\.[1-3]$/.test(c.specRef||''))continue;
  }else if(index===35){
   // v249: explicitly taught Year 2 Chemistry rate equations and Kp (through Kp only).
   if(c.subject!=='Chemistry'||c.stage!=='A2'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!['3.1.9.1','3.1.9.2','3.1.10'].includes(c.specRef))continue;
  }else if(index===36){
   // v250: only AS Physics Electricity 3.5, Year 1 taught mock.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!/^3\.5\.1\.[1-6]$/.test(c.specRef||''))continue;
  }else if(index===37){
   // v252: only the FIRST school Year 1 Pure Maths mock, no Year 2 or applied papers.
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!['3.2','3.3','3.5','3.9','3.11'].includes(c.specRef))continue;
  }else if(index===38){
   // v253: AS Physics waves 3.3, incl interference, diffraction and optical fibres.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!/^3\.3\.[12]\.[123]$/.test(c.specRef))continue;
  }else if(index===39){
   // v254: AS Chemistry atomic structure and simple TOF; no untaught A2 content.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!/^3\.1\.1\.[123]$/.test(c.specRef))continue;
  }else if(index===40){
   // v256: only taught Year 2 Chemistry Born-Haber/thermodynamics for school mock.
   if(c.subject!=='Chemistry'||c.stage!=='A2'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!['3.1.8.1','3.1.8.2'].includes(c.specRef))continue;
  }else if(index===41){
   // v257: first-year Physics Mechanics and materials ONLY, complete section 3.4 scope.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!/^3\.4\.[12]\.[1-8]$/.test(c.specRef))continue;
  }else if(index===42){
   // v260: Year 1 school Pure Maths mock, explicit nine sections, never A2/Stats/Mech.
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||!['3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9','3.11'].includes(c.specRef))continue;
  }else if(index===43){
   // v268: exclusively AS uncertainty graph recall; reject out-of-scope injected data.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.specRef!=='3.1.2'||c.strictRecall!==true)continue;
  }else if(index===44){
   // v269: AS Physics particles/decays and conservation laws, no A2 or unrelated cards.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||!['3.2.1.2','3.2.1.4','3.2.1.5','3.2.1.6','3.2.1.7'].includes(c.specRef))continue;
  }else if(index===45){
   // v272: first school Maths mock only; map/sketch B9 transformations, not Year 2.
   if(c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||c.specRef!=='3.3'||c.courseTopic!=='Year 1 Pure')continue;
  }else if(index===46){
   // v274: strictly AS inorganic Group 2/Group 7 theory; no untaught A2 content.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||!['3.2.2','3.2.3.1','3.2.3.2'].includes(c.specRef)||!['Group 2','Group 7'].includes(c.topic))continue;
  }else if(index===47){
   // v275: AS Waves 3.3.2.3 optics/step-index fibre recall only.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||c.specRef!=='3.3.2.3'||c.topic!=='Waves')continue;
  }else if(index===48){
   // v276: AQA AS Chemistry Bonding 3.1.3, no unrelated science or A2 topics.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||c.topic!=='Bonding'||!['3.1.3.1','3.1.3.2','3.1.3.4','3.1.3.5','3.1.3.6','3.1.3.7'].includes(c.specRef))continue;
  }else if(index===49){
   // v277: fill genuine AS metallic, ionic and structural bonding recall gaps.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||c.topic!=='Bonding'||!['3.1.3.1','3.1.3.2','3.1.3.3','3.1.3.4','3.1.3.7'].includes(c.specRef))continue;
  }else if(index===50){
   // v278: AQA AS Amount of Substance 3.1.2 only, for the school's taught mock.
   if(c.subject!=='Chemistry'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||c.topic!=='Amount of substance'||!['3.1.2.1','3.1.2.2','3.1.2.5'].includes(c.specRef))continue;
  }else if(index===51){
   // v279: AQA AS Physics Waves polarisation, stationary strings and diffraction.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||c.courseTopic!=='Waves'||!['3.3.1.2','3.3.1.3','3.3.2.2'].includes(c.specRef))continue;
  }else if(index===52){
   // v280: exclusively AS Physics Mechanics and Materials 3.4 selected mock scope.
   if(c.subject!=='Physics'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||c.courseTopic!=='Mechanics and materials'||!['3.4.1.1','3.4.1.2','3.4.1.3','3.4.1.6','3.4.1.7','3.4.2.1','3.4.2.2'].includes(c.specRef))continue;
  }else if(index===53){
   // v293: one-point short mock recall; strictly exclude untaught and out-of-scope Year 2 Maths/Physics.
   const physics=c.subject==='Physics'&&c.stage==='AS'&&/^3\.(?:3|4|5)\./.test(c.specRef||'');
   const chemistry=c.subject==='Chemistry'&&['AS','A2'].includes(c.stage)&&['3.3.6','3.3.7','3.3.8','3.3.9.1','3.3.9.2','3.1.10'].includes(c.specRef);
   const maths=c.subject==='Maths'&&c.stage==='AS'&&['3.2','3.3','3.4','3.5','3.6','3.8','3.9','3.11'].includes(c.specRef);
   if(!(physics||chemistry||maths)||c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||c.strictRecall!==true||!Array.isArray(c.accept)||!Array.isArray(c.reject))continue;
  }else if(index===54){
   // v298: valid mock-only short and cloze cards for all three subjects.
   // Earlier append-only banks must keep their original indices and identity.
   const physics=c.subject==='Physics'&&c.stage==='AS'&&/^3\.[1-5]\./.test(c.specRef||'');
   const chemistry=c.subject==='Chemistry'&&['AS','A2'].includes(c.stage)&&/^3\.[123]\./.test(c.specRef||'');
   const maths=c.subject==='Maths'&&c.stage==='AS'&&c.courseTopic==='Year 1 Pure'&&
    ['3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9','3.11'].includes(c.specRef);
   if(!String(c.id).startsWith('task1_v298_')||!(physics||chemistry||maths)||
      c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||
      c.strictRecall!==true||c.kind!=='short'||!Array.isArray(c.accept)||!Array.isArray(c.reject))
     continue;
  }else if(index===55){
   // v312: 31 short, one-skill mock recall cards only. Never load untaught or unrelated subjects.
   const phy=c.subject==='Physics'&&c.stage==='AS'&&c.courseTopic==='Mechanics and materials'&&
    ['3.4.1.1','3.4.1.3','3.4.1.4','3.4.1.5','3.4.1.6','3.4.2.1','3.4.2.2'].includes(c.specRef);
   const chem=c.subject==='Chemistry'&&
    ((c.stage==='AS'&&c.specRef==='3.1.4.2'&&c.courseTopic==='Energetics')||
     (c.stage==='A2'&&c.specRef==='3.1.8.2'&&c.courseTopic==='Thermodynamics'));
   if(!c.id.startsWith('task1_v312_')||!(phy||chem)||!['P003','P014','P017','P019','P024','P026','P031','P043','P046','C053','C067'].includes(c.skillId)||
      c.mock!==true||c.taught!==true||c.scope!=='mock'||c.active!==true||
      c.strictRecall!==true||c.kind!=='short'||!Array.isArray(c.accept)||!Array.isArray(c.reject)||
      c.front.length>125||c.back.length>180)continue;
  }else continue;
  knownFlashIds.add(c.id);cards.push(c);
 }
 const added=[...(x.questions||[]),...extraBanks.flatMap(bank=>bank.questions||[])],seen=new Set();
 examQuestions=[...(e.questions||[]),...added].filter(q=>{
  if(seen.has(q.id))return false;seen.add(q.id);return true;
 });
 for(const q of examQuestions){
  if(Object.prototype.hasOwnProperty.call(corrections.modelAnswers||{},q.id))q.modelAnswer=corrections.modelAnswers[q.id];
  const changes=corrections.questionCorrections?.[q.id];
  if(changes&&typeof changes==='object'){
   for(const key of ['prompt','modelAnswer','markPoints','markPointMarks','markingMode','markEvidenceRules','numericAnswer','tolerance']){
    if(Object.prototype.hasOwnProperty.call(changes,key))q[key]=changes[key];
   }
  }
 }
 deckMeta=d.meta||{};coverage=e.coverage||{};deckVersion=d.deckVersion||0;bankVersion=e.bankVersion||0;initPhysicsUnits();refreshFlashTopics(!flashTopics.size);refreshExamFilters(!examYears.size&&!examTopics.size);document.getElementById('syncState').textContent='Deck v'+deckVersion+' · '+cards.length+' flashcards · '+examQuestions.filter(q=>q.standalone!==false).length+' usable AQA question parts';if(manual)showToast(old&&deckVersion>old?'New revision content loaded':'Already up to date');renderAll()}catch{document.getElementById('syncState').textContent='Could not sync right now';if(manual)showToast('Sync failed')}
}
function switchPanel(id){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));if(id==='shop')setTimeout(renderShop,0)}
// Deep links from the retired article-preview page open the actual shop.
window.addEventListener('DOMContentLoaded',()=>{if(window.location.hash==='#shop')switchPanel('shop')});
function buildWeakSession(){const top=cards.filter(c=>c.active!==false).sort((a,b)=>weakness(b)-weakness(a)).slice(0,20);activeSession={kind:'flash',items:top.map(c=>({type:'card',id:c.id})),index:0,title:'Weak-topic flashcards'};switchPanel('study');renderAll()}

ensureProfile();
// Keep the world shop and unlocked locations usable even when the exam-bank
// sync is offline or temporarily unavailable. A later successful sync rerenders.
try{renderShop();drawGlobe()}catch(error){console.warn('World panel could not initialise',error)}
document.getElementById('pinForm').onsubmit=async e=>{e.preventDefault();const ok=await unlock(document.getElementById('pinInput').value,document.getElementById('rememberPin').checked);document.getElementById('pinError').textContent=ok?'':'Incorrect code';if(ok)sync()};
document.getElementById('pinInput').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,4)};
if(localStorage.getItem('rl_auth')==='1'||sessionStorage.getItem('rl_auth')==='1'){document.getElementById('authGate').classList.add('hidden');document.getElementById('app').classList.remove('app-locked');sync()}else document.getElementById('pinInput').focus();

document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
document.querySelectorAll('.study-type-btn').forEach(b=>b.onclick=()=>{studyType=b.dataset.study;activeSession=null;renderAll()});
document.getElementById('flashSubject').onchange=()=>{flashTopics.clear();refreshFlashTopics(true);renderAll()};
document.querySelectorAll('[data-flash-preset]').forEach(b=>b.onclick=()=>applyFlashPreset(b.dataset.flashPreset));
document.getElementById('startMock').onclick=startMockSession;
document.getElementById('mockSubject').onchange=()=>{const hint=document.getElementById('mathsMockScopeNote');if(hint)hint.hidden=document.getElementById('mockSubject').value!=='Maths'};document.getElementById('startFlashcards').onclick=startFlashSession;
document.getElementById('examDifficulty').onchange=renderTopicCounts;
document.getElementById('examLevel').onchange=()=>{examTopics.clear();examYears.clear();examTypes.clear();refreshExamFilters(true);renderTopicCounts()};
document.getElementById('examSubject').onchange=()=>{examYears.clear();examTopics.clear();examTypes.clear();refreshExamFilters(true);renderAll()};
document.getElementById('yearsAll').onclick=()=>{examYears=new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.year));refreshExamFilters(false)};
document.getElementById('yearsRecent').onclick=()=>{const ys=[...new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.year))].sort((a,b)=>b-a);examYears=new Set(ys.slice(0,2));refreshExamFilters(false)};
document.getElementById('yearsClear').onclick=()=>{examYears.clear();refreshExamFilters(false)};
document.getElementById('examTopicsAll').onclick=()=>{examTopics=new Set(subjectExam(document.getElementById('examSubject').value).map(examTopicLabel));refreshExamFilters(false)};
document.getElementById('examTopicsWeak').onclick=()=>{const sub=document.getElementById('examSubject').value,exam=subjectExam(sub),ts=[...new Set(exam.map(examTopicLabel))].sort((a,b)=>{const strength=t=>exam.filter(q=>examTopicLabel(q)===t).reduce((n,q)=>n+(profile.topicWeakness[topicKey(sub,q.revisionTopic||q.topic)]||0)+(profile.errorLog.some(z=>z.id===q.id)?2:0),0);return strength(b)-strength(a)});examTopics=new Set(ts.slice(0,Math.max(1,Math.ceil(ts.length/3))));refreshExamFilters(false)};
document.getElementById('examTopicsClear').onclick=()=>{examTopics.clear();refreshExamFilters(false)};
document.getElementById('startExam').onclick=startExamSession;
document.getElementById('startChallenge').onclick=startChallenge;document.getElementById('challengeSubject').onchange=renderChallenge;document.getElementById('challengeScope').onchange=renderChallenge;
document.getElementById('reviewWeakBtn').onclick=buildWeakSession;document.getElementById('redoMistakesBtn').onclick=startMistakes;
document.getElementById('locationRegion').onchange=()=>{locationVisibleLimit=24;renderLocationGallery();drawGlobe()};document.getElementById('showAllGlobePins').onchange=drawGlobe;document.getElementById('moreLocations').onclick=()=>{locationVisibleLimit+=24;renderLocationGallery()};document.getElementById('moreCharacters').onclick=()=>{characterVisibleLimit+=16;renderShop()};document.getElementById('characterSeries').onchange=()=>{characterVisibleLimit=16;renderShop()};document.getElementById('characterOwnedFilter').onchange=()=>{characterVisibleLimit=16;renderShop()};document.getElementById('specSubject').onchange=renderSyllabusCoverage;document.getElementById('syncBtn').onclick=()=>sync(true);document.getElementById('lockBtn').onclick=lockApp;

const globe=document.getElementById('globe');
globe.addEventListener('pointerdown',e=>{dragging=true;dragDistance=0;lastPointer={x:e.clientX,y:e.clientY};globe.setPointerCapture(e.pointerId)});
globe.addEventListener('pointermove',e=>{if(window.RevisionWorldGlobeGesture?.isPinching()){dragging=false;return}if(!dragging)return;const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y;dragDistance+=Math.hypot(dx,dy);globeLon=(globeLon-dx*.45+540)%360-180;globeLat=clamp(globeLat+dy*.3,-65,65);lastPointer={x:e.clientX,y:e.clientY};drawGlobe()});
globe.addEventListener('pointerup',e=>{if(window.RevisionWorldGlobeGesture?.isPinching()){dragging=false;return}if(dragging&&dragDistance<10){const p=globePointer(e),l=nearestPin(p.x,p.y);if(l)setLocationInfo(l.id)}dragging=false});
globe.addEventListener('pointercancel',()=>{dragging=false});
if(window.RevisionWorldGlobeGesture)window.RevisionWorldGlobeGesture.onComplete=()=>{dragging=false};

const globeFindInput=document.getElementById('globePlaceSearch');
const globeFindButton=document.getElementById('globeFindPlace');
const globeOptions=document.getElementById('globePlaceOptions');
if(globeFindInput&&globeFindButton&&globeOptions){
 const entries=window.RevisionWorldProfileSafety?.distinctLocations(LOCATIONS)||LOCATIONS;
 const fragment=document.createDocumentFragment();
 for(const place of entries){
   const option=document.createElement('option');
   option.value=place.name;
   fragment.append(option);
 }
 globeOptions.append(fragment);
 const locate=()=>{
   const query=globeFindInput.value.trim().toLowerCase();
   const match=entries.find(l=>l.name.toLowerCase()===query||l.id.toLowerCase()===query);
   if(!match){showToast('Choose a destination from the suggestions');return}
   focusOnGlobeLocation(match.id,true);
 };
 globeFindButton.onclick=locate;
 globeFindInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();locate()}});
}

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
