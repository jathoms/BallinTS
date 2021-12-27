export default (format: string) => {
  let maps;
  switch (format) {
    case "BBALL":
    case "BBALL1V1":
      maps = [
        "bball_tf_v2",
        "ctf_ballin_sky",
        "ctf_bball2",
        "ctf_bball_sweethills_v1",
        "bball_royal",
        "ctf_bball2",
        "ctf_ballin_exile",
        "ctf_ballin_wisty",
        "ctf_bball_neon",
        "ctf_bball_eventide",
        "ctf_bball_hoopdreams",
      ];
      break;
    case "SIXES":
    case "FOURS":
      maps = [
        "cp_gullywash_pro",
        "cp_metalworks_rc7",
        "cp_process_final",
        "cp_snakewater_u18",
        "cp_sunshine",
        "cp_sunshine_event",
        "koth_product_rc9",
        "cp_granary_pro_rc9",
        "koth_bagel_fc4",
      ];
      break;
    case "HIGHLANDER":
    case "PROLANDER":
      maps = [
        "koth_product_rc8",
        "pl_borneo_rc4",
        "koth_lakeside_final",
        "pl_badwater_pro_rc12",
        "pl_upward",
        "koth_proplant_v7",
        "cp_steel",
        "koth_clearcut_b15d",
      ];
      break;
    case "ULTIDUO":
      maps = ["koth_ultiduo", "ultiduo_baloo", "ultiduo_acropolis_b2"];
      break;
    default:
      maps = [
        "koth_product_rc8",
        "pl_borneo_rc4",
        "koth_lakeside",
        "pl_badwater_pro_rc12",
        "pl_upward",
        "pl_barnblitz",
        "koth_clearcut_b15d",
        "cp_gullywash_pro",
        "cp_metalworks_rc7",
        "cp_process_final",
        "cp_snakewater_u18",
        "cp_sunshine",
        "cp_sunshine_event",
        "koth_product_rc9",
        "cp_granary_pro_rc9",
        "koth_bagel_rc4",
      ];
      break;
  }
  return maps[Math.floor(Math.random() * maps.length)];
};
