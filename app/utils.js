// Based on https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/utils.js

class Utils {
  static uuid () {
    let i, random, uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
          .toString(16)
    }
    return uuid
  }

  static pluralize (count, word) {
    return count === 1 ? word : word + 's'
  }

  static store (namespace, data) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data))
    }

    let datastored = localStorage.getItem(namespace);
    return (datastored && JSON.parse(datastored)) || []
  }
}

export default Utils;
