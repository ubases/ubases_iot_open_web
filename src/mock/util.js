import Mock from "mockjs2";

const responseBody = {
  msg: 'ok',
  data: null,
  code: 0
}

export const builder = (data, msg='ok', code=0) => {
  responseBody.data = data
  responseBody.msg = msg
  responseBody.code = code
  return responseBody
}

export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}

export const mockGet = (url, data) => {
  var regExp = new RegExp(url);
  return Mock.mock(regExp,'get', data)
}

export const mockPost = (url, data) => {
  var regExp = new RegExp(url);
  return Mock.mock(regExp, 'post', data)
}

export const mockPut = (url, data) => {
  var regExp = new RegExp(url);
  return Mock.mock(regExp, 'put', data)
}

export const mockDelete = (url, data) => {
  var regExp = new RegExp(url);
  return Mock.mock(regExp, 'delete', data)
}

