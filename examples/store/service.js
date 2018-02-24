import axios from 'axios'

export const getData = () => {
  return axios
    .get("https://easy-mock.com/mock/5a2f9181c430642f15c5fef8/chart/orgtree")
    .then((res) => res.data)
}
