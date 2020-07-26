export enum BAN {
  HOUR = 'h',
  DAY = 'd',
  PERMA = 'f'
}

export enum EVENTS {
  ADVANCE = "advance",
  CHAT = "chat",
  CHAT_COMMAND = 'chatCommand',
  FRIEND_JOIN = 'friendJoin',
  GRAB_UPDATE = 'grabUpdate',
  HISTORY_UPDATE = "historyUpdate",
  MOD_SKIP = "modSkip",
  SCORE_UPDATE = "scoreUpdate",
  USER_JOIN = "userJoin",
  USER_LEAVE = "userLeave",
  USER_SKIP = "userSkip",
  VOTE_UPDATE = "voteUpdate",
  WAIT_LIST_UPDATE = "waitListUpdate"
}

export enum MUTE {
  SHORT = 's',
  MEDIUM = 'm',
  LONG = 'l',
}

export enum ROLE {
  BOUNCER = 2000,
  COHOST = 4000,
  DJ = 1000,
  HOST = 5000,
  MANAGER = 3000,
  NONE = 0,
}

export interface PlugUser {
  id: number
  avatarID: string
  badge: string
  friend: boolean
  gRole: number
  grab: boolean
  guest: boolean
  joined: string
  language: string
  level: number
  priority: number
  rawun: string
  role: ROLE
  silver: boolean
  status: number
  sub: number
  uIndex: number
  username: string
  vote: number
  _position: { c: number, r: number }
}

export interface PlugMessage {
  cid: number
  message: string
  sub: 0
  timestamp: string
  type: string
  uid: number
  un: string
}

export interface PlugMedia {
  author: string
  cid: string
  duration: 251
  format: 1
  id: 400654202
  image: string
  title: string
}

declare global {
  interface Window {
    API: {
      BAN: typeof BAN;
      ROLE: typeof ROLE;
      MUTE: typeof MUTE;
      chatLog(message: string): void;
      djJoin(): void;
      djLeave(): void;
      enabled: boolean;
      getAdmins(): PlugUser[];
      getAmbassadors(): PlugUser[];
      getAudience(): PlugUser[];
      getBannedUsers(): PlugUser[];
      getDJ(): PlugUser;
      getHistory(): any;
      getHost(): PlugUser;
      getMedia(): any;
      getNextMedia(): any;
      getScore(): any;
      getStaff(): any;
      getTimeElapsed(): any;
      getTimeRemaining(): any;
      getUser(username?: string): PlugUser;
      getUsers(): PlugUser[];
      getVolume(): any;
      getWaitList(): PlugUser[];
      getWaitListPosition(): any;
      getWaitListPosition(index: number): any;
      hasPermission(user: string, permission: string): any;
      listenTo(e, i, r): any;
      listenToOnce(e, i, r): any;
      moderateAddDJ(username: string): void;
      moderateBanUser(t, i, a): void;
      moderateDJCycle(e)
      moderateDeleteChat(t)
      moderateForceSkip(): void
      moderateLockWaitList(e, t)
      moderateMinChatLevel(e)
      moderateMoveDJ(e, t)
      moderateMuteUser(t, i, a)
      moderateRemoveDJ(t)
      moderateSetRole(t, i)
      moderateUnbanUser(t)
      moderateUnmuteUser(t)
      on(event: string, listener: Function): void;
      selectedUserID: string
      sendChat(message: string)
      setVolume(volume: number)
      stopListening(t, e, i)
      trigger(t)
    } & typeof EVENTS;
  }
}