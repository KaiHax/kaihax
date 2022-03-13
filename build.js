(() => {
  // src/wpRequire.js
  var wpRequire = window["webpackJsonpkaihei-react"].push([
    [],
    {
      get: (m, _2, wpRequire2) => m.exports = wpRequire2
    },
    [["get"]]
  ]);
  window["webpackJsonpkaihei-react"].pop();
  delete wpRequire.m.get;
  delete wpRequire.c.get;
  var wpRequire_default = wpRequire;

  // src/modules/webpack.js
  var modules = wpRequire_default.c;
  function findAll(filter) {
    let found = [];
    for (const mod in modules) {
      if (modules.hasOwnProperty(mod)) {
        const module = modules[mod].exports;
        if (module === globalThis)
          continue;
        if (module) {
          if (module.default && module.__esModule && filter(module.default))
            found.push(module.default);
          if (filter(module))
            found.push(module);
        }
      }
    }
    return found;
  }
  var webpack = {
    wpRequire: wpRequire_default,
    modules,
    find: (filter) => findAll(filter)[0],
    findAll,
    findByPropsAll: (...props) => findAll((m) => props.every((p) => m[p] !== void 0)),
    findByProps: (...props) => webpack.findByPropsAll(...props)[0],
    findByNestedPropsAll: (...props) => findAll((m) => props.every((p) => Object.keys(m).some((k) => m[k]?.[p] !== void 0)))
  };
  var webpack_default = webpack;

  // src/modules/common.js
  var bothConstants = webpack_default.findByPropsAll("app_name");
  var EN_APP_NAME = "Kaiheila";
  var common_default = {
    React: webpack_default.findByProps("createElement"),
    lodash: _,
    constantsCN: bothConstants.find((c) => c.app_name !== EN_APP_NAME),
    constantsEN: bothConstants.find((c) => c.app_name === EN_APP_NAME)
  };

  // node_modules/.pnpm/simian@1.4.3/node_modules/simian/dist/getOriginal.js
  var getOriginal = (patchChain) => typeof patchChain.prev === "function" ? patchChain.prev : getOriginal(patchChain.prev);
  var getOriginal_default = (patcherId, obj, funcName) => {
    const patchChain = obj[patcherId][funcName];
    if (patchChain === void 0)
      return obj[funcName];
    return getOriginal(patchChain);
  };

  // node_modules/.pnpm/simian@1.4.3/node_modules/simian/dist/patchChain.js
  var PatchChain = class {
    constructor(id, prev, patch) {
      this.data = {
        id,
        func: (ctx, ...args) => patch(ctx, typeof this.prev === "function" ? this.prev : this.prev.data.func, args)
      };
      this.prev = prev;
    }
  };

  // node_modules/.pnpm/simian@1.4.3/node_modules/simian/dist/removePatch.js
  var removePatch_default = (obj, funcName, patchId, patcherId) => {
    const patchChain = obj[patcherId][funcName];
    if (patchChain.data.id === patchId) {
      if (typeof patchChain.prev === "function") {
        obj[funcName] = patchChain.prev;
        delete obj[patcherId][funcName];
        return;
      }
      obj[patcherId][funcName] = patchChain.prev;
      obj[funcName] = patchChain.prev.data.func;
      return;
    }
    const recursiveTransform = (list) => {
      if (list && typeof list.prev === "object") {
        list.data = list.prev.data;
        list.prev = list.prev.prev;
        return recursiveTransform(list.prev);
      }
      return true;
    };
    const removeNode = (list) => {
      if (!list)
        throw new Error("could not find unpatch");
      if (typeof list.prev === "object" && list.data.id !== patchId)
        return removeNode(list.prev);
      return recursiveTransform(list);
    };
    let tmpChain = Object.assign({}, patchChain);
    removeNode(tmpChain);
    obj[patcherId][funcName] = tmpChain;
    obj[funcName] = tmpChain.data.func;
  };

  // node_modules/.pnpm/simian@1.4.3/node_modules/simian/dist/patcher.js
  var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _Patcher_instances;
  var _Patcher_id;
  var _Patcher_patched;
  var _Patcher_patch;
  var Patcher = class {
    constructor(embeddedName = "simian") {
      _Patcher_instances.add(this);
      _Patcher_id.set(this, void 0);
      _Patcher_patched.set(this, void 0);
      __classPrivateFieldSet(this, _Patcher_id, Symbol(embeddedName), "f");
      __classPrivateFieldSet(this, _Patcher_patched, /* @__PURE__ */ new Set(), "f");
      this.after = __classPrivateFieldGet(this, _Patcher_instances, "m", _Patcher_patch).call(this, "AFTER");
      this.before = __classPrivateFieldGet(this, _Patcher_instances, "m", _Patcher_patch).call(this, "BEFORE");
      this.instead = __classPrivateFieldGet(this, _Patcher_instances, "m", _Patcher_patch).call(this, "INSTEAD");
    }
    cleanupAll() {
      for (const obj of __classPrivateFieldGet(this, _Patcher_patched, "f")) {
        for (const funcName in obj[__classPrivateFieldGet(this, _Patcher_id, "f")]) {
          const orig = getOriginal_default(__classPrivateFieldGet(this, _Patcher_id, "f"), obj, funcName);
          obj[funcName] = orig;
          obj[__classPrivateFieldGet(this, _Patcher_id, "f")][funcName] = void 0;
        }
        obj[__classPrivateFieldGet(this, _Patcher_id, "f")] = void 0;
        delete obj[__classPrivateFieldGet(this, _Patcher_id, "f")];
      }
      __classPrivateFieldGet(this, _Patcher_patched, "f").clear();
    }
  };
  _Patcher_id = /* @__PURE__ */ new WeakMap(), _Patcher_patched = /* @__PURE__ */ new WeakMap(), _Patcher_instances = /* @__PURE__ */ new WeakSet(), _Patcher_patch = function _Patcher_patch2(t) {
    return (funcName, obj, patch) => {
      const orig = obj[funcName];
      if (typeof orig !== "function")
        throw new Error(`${funcName} is not a function on ${obj}`);
      const id = Symbol();
      if (obj[__classPrivateFieldGet(this, _Patcher_id, "f")] === void 0)
        obj[__classPrivateFieldGet(this, _Patcher_id, "f")] = {};
      let patchFunction;
      switch (t) {
        case "AFTER":
          patchFunction = (ctx, func, args) => {
            let ret = func.apply(ctx, args);
            const newRet = patch.apply(ctx, [args, ret]);
            if (typeof newRet !== "undefined")
              ret = newRet;
            return ret;
          };
          break;
        case "BEFORE":
          patchFunction = (ctx, func, args) => {
            var _a;
            let finalArgs = args;
            const newArgs = (_a = patch.apply(ctx, [args])) !== null && _a !== void 0 ? _a : args;
            if (Array.isArray(newArgs))
              finalArgs = newArgs;
            return func.apply(ctx, finalArgs);
          };
          break;
        case "INSTEAD":
          patchFunction = (ctx, func, args) => patch.apply(ctx, [args, func.bind(ctx)]);
          break;
        default:
          break;
      }
      let patchChain = obj[__classPrivateFieldGet(this, _Patcher_id, "f")][funcName];
      if (patchChain === void 0)
        patchChain = new PatchChain(id, orig, patchFunction);
      else
        patchChain = new PatchChain(id, patchChain, patchFunction);
      obj[__classPrivateFieldGet(this, _Patcher_id, "f")][funcName] = patchChain;
      obj[funcName] = function() {
        return patchChain.data.func(this, ...arguments);
      };
      Object.assign(obj[funcName], orig);
      __classPrivateFieldGet(this, _Patcher_patched, "f").add(obj);
      return () => removePatch_default(obj, funcName, id, __classPrivateFieldGet(this, _Patcher_id, "f"));
    };
  };

  // node_modules/.pnpm/simian@1.4.3/node_modules/simian/dist/index.js
  var dist_default = Patcher;

  // src/patcher.js
  var patcher_default = new dist_default("Kaihax");

  // src/en_translate/constants.js
  var overrides = {
    click_refresh: "Click to refresh",
    add: "Add",
    added: "Added",
    remove: "Remove",
    app_name: "Kaiheila (\u5F00\u9ED1\u5566)",
    prompt: "Tips",
    confirm: "Confirm",
    ok: "OK",
    cancel: "Cancel",
    home_page: "Home page",
    friend: "Friends",
    add_friend: "Add friend",
    remove_friend: "Remove friend",
    remove_friend_description: "Are you sure you want to remove {{username}} from your friends list?",
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
    check_username_identify: "Please check the username and label are spelled correctly",
    emoji_manage: "Manage emoji",
    add_emoji: "Add emoji",
    emoji_manage_description: "Here you can add your favourite server emojis to the emoji bar.",
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
    per_month_price: "Unlock perks for as little as \xA519.9 per month",
    buy_vip_can_unlock_permission: "BUFF includes a variety of perks, covering text, voice, and many other features, improving your experience.",
    buy_vip: "Buy now",
    renewal: "Renew now",
    gift_friend: "Gift to a friend",
    vip_permission: "BUFF Perks",
    vip_description: "BUFF Description",
    add_buff_make_it_more_interesting: "\u7ED9\u804A\u5929\u52A0\u4E2ABUFF\uFF0C\u8BA9\u5F00\u9ED1\u66F4\u6709\u8DA3\u3002",
    add_buff: "Buy BUFF",
    kaiheila_vip: "Activate Kaiheila BUFF",
    select_friend: "Choose a friend",
    vip_plan: "BUFF Plan",
    payment_mode: "Payment method:",
    payment_price: "Payment amount:",
    yuan: "\u5143",
    bill_record: "Billing record",
    not_found_bill: "\u627E\u4E0D\u5230\u8D26\u5355\uFF1F\u63D0\u4EA4\u5DE5\u5355",
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
    exchange_success: "Redeemed successfully"
  };
  var constants_default = () => {
    const original = Object.assign({}, common_default.constantsCN);
    Object.assign(common_default.constantsCN, overrides);
    return () => Object.assign(common_default.constantsCN, original);
  };

  // src/utils.js
  function reactFiberWalker(node, prop, goUp = false) {
    if (node.pendingProps?.[prop] !== void 0)
      return node;
    if (goUp)
      return reactFiberWalker(node.return, prop, goUp);
    if (node.child !== null)
      return reactFiberWalker(node.child, prop, goUp);
    if (node.sibling !== null)
      return reactFiberWalker(node.sibling, prop, goUp);
  }
  var getFiber = (node) => node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
  var sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
  var getComponentFromDom = async (className) => {
    let element;
    while (!element) {
      element = document.getElementsByClassName(className)[0];
      await sleep(100);
    }
    const walk = (node) => typeof node.type === "function" ? node : walk(node.return);
    return walk(getFiber(element)).type;
  };
  var startsNotAscii = (text) => (text.charCodeAt() & 65408) > 0;
  var utils_default = {
    reactFiberWalker,
    getFiber,
    sleep,
    getComponentFromDom,
    startsNotAscii
  };

  // src/en_translate/dom/CLASS_NAMES.json
  var richeditor_placeholders = "richeditor-placeholders";
  var userlist_grouptitle = "user-list-group-title";
  var msg_time = "msg-time";
  var scroll_bottom_tips = "scroll-bottom-tips";
  var message_oneline = "message-oneline";
  var welcome_tip = "welcome-tip";
  var CLASS_NAMES_default = {
    richeditor_placeholders,
    userlist_grouptitle,
    msg_time,
    scroll_bottom_tips,
    message_oneline,
    welcome_tip
  };

  // src/en_translate/dom/chatbarPlaceholders.js
  var chatbarPlaceholders_default = () => {
    const placeholder = document.getElementsByClassName(CLASS_NAMES_default.richeditor_placeholders)[0];
    if (!placeholder?.firstChild.textContent.startsWith("\u7ED9"))
      return;
    placeholder.lastChild.textContent = `Enter to send`;
    placeholder.firstChild.dataset.kaihaxenglish = "";
    const fiber = utils_default.getFiber(placeholder.firstChild);
    const chatInfo = utils_default.reactFiberWalker(fiber, "currentChat", true)?.pendingProps;
    const channelName = chatInfo.currentChannelInfo.name ?? chatInfo.currentChat.target_info?.nickname;
    placeholder.firstChild.textContent = `Send a message to ${channelName}`;
  };

  // src/en_translate/dom/memberListGroup.js
  var memberListGroup_default = () => {
    const titles = Array.from(document.getElementsByClassName(CLASS_NAMES_default.userlist_grouptitle));
    const online = titles.find((t) => t.innerText.startsWith("\u5728\u7EBF"));
    if (online)
      online.innerText = `Online ${online.innerText.split(" ")[1]}`;
  };

  // src/en_translate/dom/messageTime.js
  var messageTime_default = () => {
    const messageTimes = document.getElementsByClassName(CLASS_NAMES_default.msg_time);
    for (const elem of messageTimes) {
      if (elem.innerText.startsWith("\u4ECA\u5929 \u51CC\u6668"))
        elem.innerText = `Early this morning at ${elem.innerText.split(" ").slice(2)}`;
      else if (utils_default.startsNotAscii(elem.innerText)) {
        const replaced = elem.innerText.replaceAll("\u4E0A\u5348", "morning").replaceAll("\u4E0B\u5348", "afternoon").replaceAll("\u4ECA\u5929", "This").replaceAll("\u6628\u5929", "Yesterday");
        elem.innerText = replaced.split(" ").slice(0, -1).join(" ") + " at " + _.last(replaced.split(" "));
      }
    }
  };

  // src/en_translate/dom/nowFriends.js
  var nowFriends_default = () => {
    const elem = document.getElementsByClassName(CLASS_NAMES_default.message_oneline)[0];
    if (!elem || !elem.lastChild.innerText.startsWith("\u4F60\u4E0E"))
      return;
    const friendName = utils_default.reactFiberWalker(utils_default.getFiber(elem), "currentChat", true)?.pendingProps.currentChat.target_info.nickname;
    elem.lastChild.innerText = `You and ${friendName} are now friends.`;
  };

  // src/en_translate/dom/scrollToBottom.js
  var scrollToBottom_default = () => {
    const bar = document.getElementsByClassName(CLASS_NAMES_default.scroll_bottom_tips)[0];
    if (!bar)
      return;
    bar.firstChild.innerText = "You're viewing old messages";
    bar.lastChild.innerText = "Jump to present";
  };

  // src/en_translate/dom/TOOLTIPS.json
  var \u9891\u9053\u514D\u6253\u6270 = "Mute Channel";
  var \u53D6\u6D88\u9891\u9053\u514D\u6253\u6270 = "Unmute Channel";
  var \u7F6E\u9876 = "Pins";
  var \u7528\u6237\u5217\u8868 = "Member List";
  var \u641C\u7D22 = "Search";
  var \u7528\u6237\u8BBE\u7F6E = "User Settings";
  var \u670D\u52A1\u5668\u521B\u5EFA\u8005 = "Server Owner";
  var \u4E0A\u4F20 = "Upload";
  var \u5C55\u5F00\u8F93\u5165\u680F = "Expand Chatbar";
  var \u8BED\u97F3\u8F93\u5165\u6A21\u5F0F = "Voice Mode";
  var \u8BED\u97F3\u8BBE\u7F6E = "Voice Settings";
  var \u8868\u60C5 = "Emojis";
  var \u6DFB\u52A0\u56DE\u5E94 = "Add Response";
  var \u7F16\u8F91\u6D88\u606F = "Edit";
  var \u56DE\u590D = "Reply";
  var \u66F4\u591A = "More";
  var \u89E3\u9501\u6A2A\u5E45 = "Unlock banners";
  var \u521B\u5EFA\u65B0\u9891\u9053 = "New Channel";
  var \u518D\u6B21\u70B9\u51FB\u8FDB\u5165\u9891\u9053 = "Double click to join";
  var \u521B\u5EFA\u9080\u8BF7 = "Invite people";
  var \u7F16\u8F91\u9891\u9053 = "Edit Channel";
  var \u6DFB\u52A0\u670D\u52A1\u5668 = "Add Server";
  var \u53D1\u73B0\u670D\u52A1\u5668 = "Explore Servers";
  var \u4E0B\u8F7D\u5BA2\u6237\u7AEF = "Download Apps";
  var \u6211\u7684\u4E3B\u9875 = "Home";
  var \u666E\u901A\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969490\u5929_br___BUFF\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969410\u5929 = "Name change allowed every 90 days<br />BUFF users can change name every 10 days";
  var REGEX_\u8DDD\u79BB\u4E0B\u4E00\u4E2A\u7B49\u7EA7\u8FD8\u9700__d__\u4E2A\u52A9\u529B\u5305 = "Next level in $1 boosts";
  var \u590D\u5236\u7528\u6237\u540D = "Copy Username";
  var \u590D\u5236\u6210\u529F = "Copied!";
  var \u5B98\u65B9\u8BA4\u8BC1 = "Verified";
  var \u5408\u4F5C\u4F19\u4F34 = "Partnered";
  var TOOLTIPS_default = {
    \u9891\u9053\u514D\u6253\u6270,
    \u53D6\u6D88\u9891\u9053\u514D\u6253\u6270,
    \u7F6E\u9876,
    \u7528\u6237\u5217\u8868,
    \u641C\u7D22,
    \u7528\u6237\u8BBE\u7F6E,
    \u670D\u52A1\u5668\u521B\u5EFA\u8005,
    \u4E0A\u4F20,
    \u5C55\u5F00\u8F93\u5165\u680F,
    \u8BED\u97F3\u8F93\u5165\u6A21\u5F0F,
    \u8BED\u97F3\u8BBE\u7F6E,
    \u8868\u60C5,
    \u6DFB\u52A0\u56DE\u5E94,
    \u7F16\u8F91\u6D88\u606F,
    \u56DE\u590D,
    \u66F4\u591A,
    \u89E3\u9501\u6A2A\u5E45,
    \u521B\u5EFA\u65B0\u9891\u9053,
    \u518D\u6B21\u70B9\u51FB\u8FDB\u5165\u9891\u9053,
    \u521B\u5EFA\u9080\u8BF7,
    \u7F16\u8F91\u9891\u9053,
    \u6DFB\u52A0\u670D\u52A1\u5668,
    \u53D1\u73B0\u670D\u52A1\u5668,
    \u4E0B\u8F7D\u5BA2\u6237\u7AEF,
    \u6211\u7684\u4E3B\u9875,
    "\u666E\u901A\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969490\u5929<br />BUFF\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969410\u5929": \u666E\u901A\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969490\u5929_br___BUFF\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969410\u5929,
    "REGEX_\u8DDD\u79BB\u4E0B\u4E00\u4E2A\u7B49\u7EA7\u8FD8\u9700(\\d+)\u4E2A\u52A9\u529B\u5305": REGEX_\u8DDD\u79BB\u4E0B\u4E00\u4E2A\u7B49\u7EA7\u8FD8\u9700__d__\u4E2A\u52A9\u529B\u5305,
    \u590D\u5236\u7528\u6237\u540D,
    \u590D\u5236\u6210\u529F,
    \u5B98\u65B9\u8BA4\u8BC1,
    \u5408\u4F5C\u4F19\u4F34
  };

  // src/en_translate/dom/tooltips.js
  var simpleTooltips = {};
  var regexTooltips = [];
  for (const key in TOOLTIPS_default) {
    const replacement = TOOLTIPS_default[key];
    if (key.startsWith("REGEX_"))
      regexTooltips.push([new RegExp(key.substr(6), "g"), replacement]);
    else
      simpleTooltips[key] = replacement;
  }
  var matchTooltip = (tip) => {
    if (simpleTooltips[tip])
      return simpleTooltips[tip];
    for (const [match, replacement] of regexTooltips)
      if (tip.match(match)?.[0] === tip)
        return tip.replaceAll(match, replacement);
  };
  var tooltips_default = () => {
    const elems = document.querySelectorAll("[data-tip]");
    for (const elem of elems)
      elem.dataset.tip = matchTooltip(elem.dataset.tip) ?? elem.dataset.tip;
  };

  // src/en_translate/dom/welcomeTips.js
  var welcomeTips_default = () => {
    const tip = document.getElementsByClassName(CLASS_NAMES_default.welcome_tip)[0];
    if (!tip || !utils_default.startsNotAscii(tip.innerText))
      return;
    if (tip.innerText.startsWith("\u8FD9\u91CC\u662F\u4F60\u4E0E")) {
      const userName = utils_default.reactFiberWalker(utils_default.getFiber(tip), "currentChat", true)?.pendingProps.currentChat.target_info.nickname;
      tip.innerText = `This is the beginning of your PMs with @${userName}.`;
    } else if (tip.innerText.startsWith("\u6B22\u8FCE\u6765\u5230")) {
      tip.firstChild.textContent = "This is the beginning of #";
      tip.removeChild(tip.childNodes[2]);
      tip.childNodes[2].textContent = ". ";
      tip.lastChild.innerText = "You are witnessing history.";
    }
  };

  // src/en_translate/dom/index.js
  var translateElements = () => {
    chatbarPlaceholders_default();
    memberListGroup_default();
    messageTime_default();
    scrollToBottom_default();
    nowFriends_default();
    welcomeTips_default();
    tooltips_default();
  };
  var dom_default = () => {
    const interval = setInterval(translateElements, 500);
    return () => clearInterval(interval);
  };

  // src/en_translate/index.js
  var en_translate_default = () => {
    const patches = [constants_default(), dom_default()];
    return () => _.forEachRight(patches, (p) => p());
  };

  // src/index.js
  if (window.kaihax) {
    console.log("Kaihax already loaded, uninjecting first");
    kaihax.uninject();
  }
  var untranslate = en_translate_default();
  window.kaihax = {
    modules: {
      webpack: webpack_default,
      common: common_default
    },
    patcher: {
      after: patcher_default.after,
      before: patcher_default.before,
      instead: patcher_default.instead
    },
    utils: utils_default,
    uninject: () => {
      patcher_default.cleanupAll();
      untranslate();
      delete window.kaihax;
    }
  };
  console.log("Kaihax loaded");
})();
//# sourceURL=Kaihax