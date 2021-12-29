const sleep = async (num = 0.8) => {
  return new Promise(resolve => {
    const interval = setInterval(async () => {
      resolve();
      clearInterval(interval);
    }, num * 1000);
  });
};

module.exports = sleep;
