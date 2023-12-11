const isCreatedRoomAndNotEqualPresenterEmail = (email: string, roomInfo: Record<string, string>): boolean => {
  return Object.keys(roomInfo).length > 0 && roomInfo.presenterEmail !== email;
};

export { isCreatedRoomAndNotEqualPresenterEmail };
