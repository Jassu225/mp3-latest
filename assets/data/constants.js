const path = require("path");

const sideNavContent = {
    home: {title: "Home", icon: "home"},
    upload: { title: 'Upload', icon: 'file_upload' },
    profile: { title: 'Profile', icon: 'account_box'},
    filesUploading: { title: 'Files Uploading', icon: 'cloud_upload' },
    playlists: {title: 'Playlists', icon: 'list'},
    settings: {title: 'Settings', icon: 'settings'},
};

let homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

const dirs  = {
    homeDir: homeDir,
    downloadsDir: path.join(homeDir, "Downloads"),
    musicDir: path.join(homeDir, "Music"),
};

const mutationTypes = {
    CREATE_AUDIO_PLAYER_REFERENCE: 'createAudioPlayerReference',
    CREATE_MUSIC_CONTROLS_REFERENCE: 'createMusicControlsReference',
    SELECT_SONG: 'selectSong',
    SELECT_ALBUM: 'selectAlbum',
    SELECT_ARTIST: 'selectArtist',
    SET_PLAYLIST: 'setPlaylist',
    // Music Controls' Actions
    // -------------------------------------------------------------------
    SELECT_SONG_BASED_ON_PLAYMODE: 'selectNextSongBasedOnPlayMode',
    TOGGLE_SHUFFLE: 'toggleShuffle',
    // -------------------------------------------------------------------
    // To change sideNav prop
    TOGGLE_SIDENAV: 'toggleSidenav',
    // To switch b/w tabs
    SWITCH_TABS: 'switchTabs',
    // To check if tabs are shown on screen
    CHANGE_TABS_VISIBILITY: 'changeTabsVisibility',
    // SET PLAY MODE
    SET_PLAY_MODE: 'setPlaymode',
    // play Next Song action
    PLAY_NEXT: 'playNext',
    ADD_TO_QUEUE: 'addToQueue',
    // key controls
    MUTE_AUDIO: 'muteAudio',
    // used to update songs in store after converting them to instances of Song class
    SET_FORMATTED_SONGS: 'setFormattedSongs',
    SET_FORMATTED_ALBUMS: 'setFormattedAlbums',
    SET_FORMATTED_ARTISTS: 'setFormattedArtists',
    // new view
    SHOW_ALBUM_VIEW: 'showAlbumView',
};

const actionTypes = {
    GET_SONGS: 'getSongs',
    GET_SONGS_FROM_SERVER: 'getSongsFromServer',
    GET_ALBUMS: 'getAlbums',
    GET_ALBUMS_FROM_SERVER: 'getaAlbumsFromServer',
    GET_SONGS_FROM_DB: 'getSongsFromDB',
    GET_SONGS_FROM_SYSTEM: 'getSongsFromSystem',
    GET_ALBUMS_FROM_DB: 'getAlbumsFromDB',
    GET_ALBUMS_FROM_SYSTEM: 'getAlbumsFromSystem',
    GET_ARTISTS_FROM_DB: 'getArtistsFromDB',
    FORMAT_SONGS: 'formatSongs',
    FORMAT_ALBUMS: 'formatAlbums',
    FORMAT_ARTISTS: 'formatArtists',
};

const AVIcons = {
    playArrow : 'play_arrow',
    pause: 'pause',
    playlistAdd: 'playlist_add',
    queue: 'queue',
    playNext: 'queue_play_next',
    add: 'add',
    // controls
    replay: 'replay',
    replayTenSeconds: 'replay_10',
    replayFiveSeconds: 'replay_5',
    fastRewind: 'fast_rewind',
    skipPrevious: 'skip_previous',
    playCircle: 'play_circle_outline',
    pauseCircle: 'pause_circle_outline',
    skipNext: 'skip_next',
    forwardTenSeconds: 'forward_10',
    forwardFiveSeconds: 'forward_5',
    fastForward: 'fast_forward',
    shuffle: 'shuffle',
    mute: 'volume_off',
    unmute: 'volume_up',
    volumeUp: 'volume_up',
    volumeDown: 'volume_down',
    volumeOff: 'volume_off',
    // playMode Icons
    loopAll: 'loop',
    onceAll: 'trending_flat',
    repeatOne: 'repeat_one',
};

const playModes = {
    // Play index-wise from song Array in a loop
    LOOP_ALL: AVIcons.loopAll,
    // Play index-wise from song Array
    ONCE_ALL: AVIcons.onceAll,
    // Repeat selected song
    REPEAT_ONE: AVIcons.repeatOne,
};

const stateProps = {
    sideNavbar: 'sideNavbar',
    tab: 'tab',
    Tabs: 'Tabs',
};

// KeyPress charcodes
const KeyPress  = {
    SPACE_BAR: 32,
    M: 77,
    m: 109,
    l: 108,
    L: 76,
};

const images = {
    defaultSongCover: '/dist/defaultSongCover.png', 
    defaultAlbumCover: '/dist/defaultAlbumCover.png',
    defaultArtistCover: '/dist/defaultArtistCover.png',
};

export {
    sideNavContent,
    mutationTypes,
    actionTypes,
    AVIcons,
    playModes,
    stateProps,
    KeyPress,
    dirs,
    images,
};
