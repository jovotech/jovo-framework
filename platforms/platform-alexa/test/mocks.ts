import nock, { Scope } from 'nock';

interface AlexaMockSpec {
  response: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    body: any;
    statusCode: 200 | 403 | 401;
  };

  method: 'GET' | 'POST';
  permissionToken: string;
  path: string;

  endpoint?: string;
  times?: number;
}

export function mockAlexaApi(spec: AlexaMockSpec): Scope {
  const url = spec.endpoint || 'https://api.amazonalexa.com';
  return nock(url, {
    reqheaders: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${spec.permissionToken}`,
    },
  })
    .intercept(spec.path, spec.method)
    .times(spec.times || 1)
    .reply(spec.response.statusCode, spec.response.body);
}
