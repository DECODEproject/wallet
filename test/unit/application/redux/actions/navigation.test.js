import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { goToPilotScreen } from '../../../../../application/redux/actions/navigation';

jest.mock('../../../../../node_modules/ex-react-native-i18n', () => ({
  locales: { get: () => ({}) },
}));

const mockStore = configureMockStore([thunk]);

describe('navigation actions', () => {
  describe('goToPilot', () => {
    it('should go to decidm pilot if there is a link', () => {
      const store = mockStore({
        petitionLink: {
          petitionLink: 'dicidim-url',
        },
        navigation: {},
      });
      store.dispatch(goToPilotScreen());

      const action = store.getActions()[0];
      expect(action.child.routeName).toEqual('attributesSummary');
    });

    it('should go to landing page if there is no link', () => {
      const store = mockStore({
        petitionLink: {
          petitionLink: undefined,
        },
        navigation: {},
      });
      store.dispatch(goToPilotScreen());

      const action = store.getActions()[0];
      expect(action.child.routeName).toEqual('attributesLanding');
    });
  });
});
