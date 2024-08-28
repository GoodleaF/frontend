import axios from "axios";

export default {
  methods: {
    async $api(rul, method, data) {
      return (
        await axios({
          method: method,
          url,
          data,
        }).catch((e) => {
          console.error(e);
        })
      ).data;
    },
  },
};
