import isComingFromLogin from '../../../lib/entryPoint';
import * as urlModule from '../../../application/utils/url';

describe('isComingFromLogin', () => {
  const nonLoginUrl = 'exp://localhost:19000/signout';
  const loginUrl = 'decodewallet://login?header={predicate:”schema:iotCommunity”}&sessionId=9876&callback=http://bcnnow.decodeproject.eu/wallet-login';


  it('should return false if current url\'s hostname is something other than /login', async () => {
    urlModule.default = jest.fn().mockReturnValue(Promise.resolve(nonLoginUrl));

    const result = await isComingFromLogin();
    expect(result).toEqual(false);
  });

  it('should return true if current url\'s hostname is login', async () => {
    urlModule.default = jest.fn().mockReturnValue(Promise.resolve(loginUrl));

    const result = await isComingFromLogin();
    expect(result).toEqual(true);
  });
});