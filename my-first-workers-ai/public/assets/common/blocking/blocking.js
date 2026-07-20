function useBlocking() {
  const DOM_ID = "blocking";
  let blockCount = 0;

  function getBlockingDom() {
    return document.getElementById(DOM_ID);
  }

  function block() {
    let calledUnblock = false;
    blockCount++;

    if (blockCount > 0) {
      if (getBlockingDom() == null) {
        const blocking = document.createElement("div");
        const blockingSpinner = document.createElement("div");

        blocking.id = DOM_ID;
        blocking.classList.add("Blocking");

        blockingSpinner.classList.add("Blocking--spinner");

        blocking.append(blockingSpinner);

        document.body.append(blocking);
      }
    }

    return () => {
      if (!calledUnblock) {
        calledUnblock = true;
        unblock();
      }
    };
  }

  function unblock() {
    blockCount--;

    if (blockCount <= 0) {
      getBlockingDom()?.remove();
    }
  }

  async function withBlocking(fn) {
    try {
      block();

      return await fn();
    } finally {
      unblock();
    }
  }

  return {
    block,
    unblock,
    withBlocking,
  };
}

export { useBlocking };
