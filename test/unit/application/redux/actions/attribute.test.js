import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveAttributes, addCredentialFromUrl, storeCredentials, addCredential, loadCredentials } from '../../../../../application/redux/actions/attributes';
import types from '../../../../../application/redux/actionTypes';

const mockStore = configureMockStore([thunk]);

describe('attribute action', () => {
  let store;
  const barcelonaResidencyAttribute = {
    predicate: 'schema:addressLocality',
    object: 'Barcelona',
    scope: 'can-access',
    provenance: {
      source: 'http://atlantis-decode.s3-website-eu-west-1.amazonaws.com',
      credentials: '0123456789',
    },
    subject: '(Alpaca)',
  };

  beforeEach(() => {
    store = mockStore({
      navigation: {
        currentNavigatorUID: 2,
      },
      attributes: {
        list: new Map(),
      },
    });
  });

  it('ADD Attribute action', () => {
    const attribute = {
      predicate: 'schema:addressLocality',
      object: 'Barcelona',
      scope: 'can-access',
      credentialIssuer: {
        url: 'http://atlantis-decode.s3-website-eu-west-1.amazonaws.com',
      },
    };
    const walletId = '(21323123123)';
    const url = 'exp://localhost:19000/+?credential=0123456789';


    const expectedActions = [{
      type: types.ADD_CREDENTIAL_FROM_URL,
      attribute,
      walletId,
      credential: '0123456789',
    }];

    store.dispatch(addCredentialFromUrl(attribute, walletId, url));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('SAVE current credentials action when no credentials in the state', async () => {
    store = mockStore({
      attributes: {
        list: new Map(),
      },
    });
    const setItemAsync = jest.fn().mockReturnValue(Promise.resolve(0));

    await store.dispatch(storeCredentials(setItemAsync));

    expect(setItemAsync).toBeCalled();
    expect(setItemAsync).toBeCalledWith('attributes', '[]');

    expect(store.getActions()).toEqual([{
      type: types.STORE_ATTRIBUTES,
      attributes: new Map(),
    }]);
  });

  it('SAVE current credentials action when only one credential', async () => {
    store = mockStore({
      attributes: {
        list: new Map([[barcelonaResidencyAttribute.predicate, barcelonaResidencyAttribute]]),
      },
    });
    const setItemAsync = jest.fn().mockReturnValue(Promise.resolve(0));

    await store.dispatch(storeCredentials(setItemAsync));

    expect(setItemAsync).toBeCalled();
    expect(setItemAsync).toBeCalledWith('attributes', JSON.stringify([barcelonaResidencyAttribute]));

    expect(store.getActions()).toEqual([{
      type: types.STORE_ATTRIBUTES,
      attributes: new Map([[barcelonaResidencyAttribute.predicate, barcelonaResidencyAttribute]]),
    }]);
  });

  it('addCredential when there is no credentials yet', async () => {
    store = mockStore({
      attributes: {
        list: new Map(),
      },
    });
    const setItemAsync = jest.fn().mockReturnValue(Promise.resolve(0));
    const attribute = {
      predicate: 'schema:addressLocality',
      object: 'Barcelona',
      scope: 'can-access',
      provenance: {
        url: 'http://atlantis-decode.s3-website-eu-west-1.amazonaws.com',
      },
    };
    const walletId = '(21323123123)';
    const url = 'exp://localhost:19000/+?credential=0123456789';

    await store.dispatch(addCredential(attribute, walletId, url, setItemAsync));

    expect(setItemAsync).toBeCalled();
    expect(setItemAsync).toBeCalledWith('attributes', '[]');
    expect(store.getActions()).toEqual([
      {
        type: types.ADD_CREDENTIAL_FROM_URL,
        attribute,
        walletId,
        credential: '0123456789',
      }, {
        type: types.STORE_ATTRIBUTES,
        attributes: new Map(),
      },
    ]);
  });

  it('load credentials when nothing is stored', async () => {
    const credentials = [];
    const getItemAsync = jest.fn().mockReturnValue(Promise.resolve(JSON.stringify(credentials)));

    await store.dispatch(loadCredentials(getItemAsync));

    expect(getItemAsync).toBeCalled();
    expect(getItemAsync).toBeCalledWith('attributes');
    expect(store.getActions()).toEqual([{
      type: types.LOAD_ATTRIBUTES,
      attributes: new Map(),
    }]);
  });

  it('load credentials when one attribute is stored', async () => {
    const credentials = [barcelonaResidencyAttribute];
    const getItemAsync = jest.fn().mockReturnValue(Promise.resolve(JSON.stringify(credentials)));

    await store.dispatch(loadCredentials(getItemAsync));

    expect(getItemAsync).toBeCalled();
    expect(getItemAsync).toBeCalledWith('attributes');
    expect(store.getActions()).toEqual([{
      type: types.LOAD_ATTRIBUTES,
      attributes: new Map([
        [barcelonaResidencyAttribute.predicate, barcelonaResidencyAttribute],
      ]),
    }]);
  });

  describe('save attributes', () => {
    const walletId = 42;
    const someDistrict = '3';
    const someDateOfBirth = '01/01/2000';
    const someGender = 'F';
    const setItemAsync = async () => {};

    it('should dispatch an action to save date of birth if set', async () => {
      await store.dispatch(saveAttributes(
        someDateOfBirth,
        someDistrict,
        someGender,
        walletId,
        setItemAsync,
      ));

      const expectedAction = {
        type: types.ADD_OPTIONAL_ATTRIBUTE,
        attribute: {
          predicate: 'schema:dateOfBirth',
          object: someDateOfBirth,
          scope: 'can-access',
          provenance: {
            source: 'wallet',
          },
          subject: walletId,
        },
      };
      const containsExpectedAction = expect.arrayContaining([expectedAction]);
      expect(store.getActions()).toEqual(containsExpectedAction);
    });

    it('should not dispatch an action to save date of birth if empty', async () => {
      await store.dispatch(saveAttributes('', someDistrict, someGender, walletId, setItemAsync));

      const containsAddDateOfBirthAction = store.getActions()
        .some(action =>
          action.type === types.ADD_OPTIONAL_ATTRIBUTE
          && action.attribute.predicate === 'schema:dateOfBirth');
      expect(containsAddDateOfBirthAction).toEqual(false);
    });

    it('should dispatch an action to save district if set', async () => {
      await store.dispatch(saveAttributes(
        someDateOfBirth,
        someDistrict,
        someGender,
        walletId,
        setItemAsync,
      ));

      const expectedAction = {
        type: types.ADD_OPTIONAL_ATTRIBUTE,
        attribute: {
          predicate: 'schema:district',
          object: someDistrict,
          scope: 'can-access',
          provenance: {
            source: 'wallet',
          },
          subject: walletId,
        },
      };
      const containsExpectedAction = expect.arrayContaining([expectedAction]);
      expect(store.getActions()).toEqual(containsExpectedAction);
    });

    it('should not dispatch an action to save district if empty', async () => {
      await store.dispatch(saveAttributes(someDateOfBirth, '', someGender, walletId, setItemAsync));

      const containsAddDistrictAction = store.getActions()
        .some(action =>
          action.type === types.ADD_OPTIONAL_ATTRIBUTE
          && action.attribute.predicate === 'schema:district');
      expect(containsAddDistrictAction).toEqual(false);
    });

    it('should dispatch an action to save gender if set', async () => {
      await store.dispatch(saveAttributes(
        someDateOfBirth,
        someDistrict,
        someGender,
        walletId,
        setItemAsync,
      ));

      const expectedAction = {
        type: types.ADD_OPTIONAL_ATTRIBUTE,
        attribute: {
          predicate: 'schema:gender',
          object: someGender,
          scope: 'can-access',
          provenance: {
            source: 'wallet',
          },
          subject: walletId,
        },
      };
      const containsExpectedAction = expect.arrayContaining([expectedAction]);
      expect(store.getActions()).toEqual(containsExpectedAction);
    });

    it('should not dispatch an action to save gender if empty', async () => {
      await store.dispatch(saveAttributes(someDateOfBirth, someDistrict, '', walletId, setItemAsync));

      const containsAddGenderAction = store.getActions()
        .some(action =>
          action.type === types.ADD_OPTIONAL_ATTRIBUTE
          && action.attribute.predicate === 'schema:gender');
      expect(containsAddGenderAction).toEqual(false);
    });

    it('should dispatch an action to store the attributes to local storage', async () => {
      const attributesList = new Map([
        ['schema:dateOfBirth', {
          predicate: 'schema:dateOfBirth',
          object: someDateOfBirth,
          scope: 'can-access',
          provenance: {
            source: 'wallet',
          },
          subject: walletId,
        }],
      ]);
      store = mockStore({
        attributes: {
          list: attributesList,
        },
        navigation: {
          currentNavigatorUID: 2,
        },
      });
      const mockedSetItem = jest.fn().mockReturnValue(Promise.resolve(0));

      await store.dispatch(saveAttributes(
        someDateOfBirth,
        someDistrict,
        someGender,
        walletId,
        mockedSetItem,
      ));

      expect(mockedSetItem).toBeCalled();
      expect(mockedSetItem).toBeCalledWith('attributes', JSON.stringify([...attributesList.values()]));

      const expectedAction = {
        type: types.STORE_ATTRIBUTES,
        attributes: attributesList,
      };
      const containsExpectedAction = expect.arrayContaining([expectedAction]);
      expect(store.getActions()).toEqual(containsExpectedAction);
    });

    it('should navigate to the attributes landing page', async () => {
      await store.dispatch(saveAttributes(
        someDateOfBirth,
        someDistrict,
        someGender,
        walletId,
        setItemAsync,
      ));

      const navigationAction = store.getActions()
        .find(action => action.type === 'EX_NAVIGATION.PUSH');
      expect(navigationAction.child.routeName).toEqual('attributesLanding');
    });

    it('should dispatch a SAVE_ATTRIBUTES action', async () => {
      await store.dispatch(saveAttributes(
        someDateOfBirth,
        someDistrict,
        someGender,
        walletId,
        setItemAsync,
      ));

      const expectedAction = {
        type: types.SAVE_ATTRIBUTES,
        dateOfBirth: someDateOfBirth,
        district: someDistrict,
      };
      const containsExpectedAction = expect.arrayContaining([expectedAction]);
      expect(store.getActions()).toEqual(containsExpectedAction);
    });

    it('should dispatch and return a SAVE_ATTRIBUTES_ERROR action if failed', async () => {
      const failedSetItem = async () => { throw new Error('Fake error'); };
      await store.dispatch(saveAttributes(
        someDateOfBirth,
        someDistrict,
        someGender,
        walletId,
        failedSetItem,
      ));
      const expectedAction = {
        type: types.SAVE_ATTRIBUTES_ERROR,
      };
      const containsExpectedAction = expect.arrayContaining([expectedAction]);
      expect(store.getActions()).toEqual(containsExpectedAction);
    });

    it('should dispatch a RESET_DATE_OF_BIRTH_ERRORS action', async () => {
      await store.dispatch(saveAttributes(
        someDateOfBirth,
        someDistrict,
        someGender,
        walletId,
        setItemAsync,
      ));
      const expectedAction = {
        type: types.RESET_ATTRIBUTES_ERRORS,
      };
      const containsExpectedAction = expect.arrayContaining([expectedAction]);
      expect(store.getActions()).toEqual(containsExpectedAction);
    });
  });
});
