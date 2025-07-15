const getMessageHeightOffset = (heightOfMessageBox, windowHeight) => {
  const maxHeightOfMessageBox = windowHeight * 0.18;
  if (heightOfMessageBox > maxHeightOfMessageBox) {
    return heightOfMessageBox - windowHeight * 0.035;
  }
  return 0;
};

export default getMessageHeightOffset;
