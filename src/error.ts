export const Err = {
  USER: {
    NOT_FOUND: {
      code: 400,
      message: '사용자가 존재하지 않습니다.',
    },
    EXISTING_USER: {
      code: 400,
      message: '이미 존재하는 사용자입니다.',
    },
  },
  TOKEN: {
    INVALID_TOKEN: {
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    },
    JWT_EXPIRED: {
      code: 410,
      message: '토큰이 만료되었습니다.',
    },
    JWT_NOT_REISSUED: {
      code: 405,
      message: '토큰 만료 7일전부터 갱신이 가능합니다.',
    },
    NO_PERMISSION: {
      code: 403,
      message: '해당 요청의 권한이 없습니다',
    },
    NOT_SEND_REFRESH_TOKEN: {
      code: 401,
      message: 'Refresh Token이 전송되지 않았습니다.',
    },
    NOT_SEND_TOKEN: {
      code: 401,
      message: 'Token이 전송되지 않았습니다.',
    },
  },
  KAKAO: {
    INVALID_TOKEN: {
      code: 401,
      message: '유효하지 않은 카카오 토큰입니다.',
    },
  },
};
