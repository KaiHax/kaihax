import common from "../modules/common";
import EN_CONSTANTS from "./EN_CONSTANTS.json"

/*const overrides = {
  click_refresh: "Click to refresh",
  add: "Add",
  added: "Added",
  remove: "Remove",
  app_name: "Kaiheila (开黑啦)",
  prompt: "Tips",
  confirm: "Confirm",
  ok: "OK",
  cancel: "Cancel",
  home_page: "Home page",
  friend: "Friends",
  add_friend: "Add friend",
  remove_friend: "Remove friend",
  remove_friend_description:
    "Are you sure you want to remove {{username}} from your friends list?",
  online: "Online",
  all: "All",
  requested: "Requested",
  request_to_be_friend: "Send friend request",
  blocked: "Blocked",
  private_message: "Private messages",
  not_friend: "Uh... No friends yet.",
  not_online_friend: "None of your friends are online, go call them to play!",
  not_pending_friend_requested: "No pending friend requests",
  not_blocked: "You haven't blocked anyone.",
  request_send_success: "Sent request",
  request_send_error: "Failed to send request",
  placeholder_username: "<Please enter username>#0000",
  friend_request_error: "Friend request failed",
  send_friend_request: "Send a friend request",
  require_username_identify: "Username and tag required to add a friend",
  check_username_identify:
    "Please check the username and label are spelled correctly",
  emoji_manage: "Manage emoji",
  add_emoji: "Add emoji",
  emoji_manage_description:
    "Here you can add your favourite server emojis to the emoji bar.",
  emoji_added: "Emoji added",
  emoji_not_added: "Emoji not added",
  drag_modify_emoji_order: "Drag and drop to modify the order of emojis",
  click_preview: "Click to preview",
  preview: "Preview",
  static_emoji: "Static emoji",
  gif_emoji: "GIF emoji",
  guild_not_emoji: "This server does not have any emojis",
  emoji_all_added: "Max emoji reached",
  want_use_emoji: "Want to use emojis?",
  buy_vip_use_emoji: "Buy BUFF to use emojis from servers anywhere!",
  learn_more: "Learn more",
  add_chat_buff: "Add a chat BUFF?",
  per_month_price: "Unlock perks for as little as ¥19.9 per month",
  buy_vip_can_unlock_permission:
    "BUFF includes a variety of perks, covering text, voice, and many other features, improving your experience.",
  buy_vip: "Buy now",
  renewal: "Renew now",
  gift_friend: "Gift to a friend",
  // header in the settings panel
  vip_permission: "BUFF Perks",
  vip_description: "BUFF Description",
  add_buff_make_it_more_interesting: "给聊天加个BUFF，让开黑更有趣。",
  // bottom bar button
  add_buff: "Buy BUFF",
  kaiheila_vip: "Activate Kaiheila BUFF",
  // titlebar in dialog
  select_friend: "Choose a friend",
  vip_plan: "BUFF Plan",
  payment_mode: "Payment method:",
  payment_price: "Payment amount:",
  yuan: "元",
  bill_record: "Billing record",
  not_found_bill: "找不到账单？提交工单",
  date: "Date",
  buy_goods: "Buy goods",
  purpose: "Purpose",
  bill_id: "Order no.:",
  payment_time: "Payment time:",
  use_time: "Recharge time:",
  gift_user: "Recipient:",
  bill_wrong: "Order incorrect?",
  kindly_reminder: "Gentle reminder",
  bill_tips: `1. The system will automatically recharge after successful payment, and will automatically recharge within 24 hours if it initially fails. 
2. If the net banking duplicate payment or order is cancelled after payment, and the recharge is not successful, the net banking refund will arrive within 15 working days.`,
  bill_list_none: "No billing records",
  cdkey: "Redemption Code",
  exchange_vip_please_input_cdkey: "Got a gift? Enter the code below:",
  exchange: "Exchange",
  exchange_success: "Redeemed successfully",
};*/

export default () => {
  const original = {...common.constantsCN};
  Object.assign(common.constantsCN, EN_CONSTANTS);

  return () => Object.assign(common.constantsCN, original);
};
