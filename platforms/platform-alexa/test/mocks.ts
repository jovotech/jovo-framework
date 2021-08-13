import nock, { Scope } from 'nock';

interface MockSpec {
  response: {
    body: any;
    statusCode: 200 | 403;
  };

  method: 'GET' | 'POST';
  permissionToken: string;
  path: string;

  endpoint?: string;
  times?: number;
}

export function mockAlexaApi(spec: MockSpec): Scope {
  const url = spec.endpoint || 'https://api.amazonalexa.com';
  return nock(url, {
    reqheaders: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${spec.permissionToken}`,
    },
  })
  // TODO: Can we pass method here somehow?
    .get(spec.path)
    .times(spec.times || 1)
    .reply(spec.response.statusCode, spec.response.body);
}
