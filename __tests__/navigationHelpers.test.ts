import { StackActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import { navigateToDetail, navigateToSeeAll } from '../src/navigation/helpers';

function mockNavChain(
  rootDispatch: jest.Mock,
): { leaf: NavigationProp<ParamListBase> } {
  const root: NavigationProp<ParamListBase> = {
    getParent: () => undefined,
    dispatch: rootDispatch,
  } as unknown as NavigationProp<ParamListBase>;
  const leaf: NavigationProp<ParamListBase> = {
    getParent: () => root,
    dispatch: jest.fn(),
  } as unknown as NavigationProp<ParamListBase>;
  return { leaf };
}

describe('navigation helpers', () => {
  it('navigateToDetail dispatches StackActions.push on the root navigator', () => {
    const rootDispatch = jest.fn();
    const { leaf } = mockNavChain(rootDispatch);
    navigateToDetail(leaf, 99);
    expect(rootDispatch).toHaveBeenCalledTimes(1);
    expect(rootDispatch).toHaveBeenCalledWith(StackActions.push('Detail', { movieId: 99 }));
  });

  it('navigateToSeeAll dispatches StackActions.push on the root navigator', () => {
    const rootDispatch = jest.fn();
    const { leaf } = mockNavChain(rootDispatch);
    const params = { title: 'Trending', mode: 'trending' as const };
    navigateToSeeAll(leaf, params);
    expect(rootDispatch).toHaveBeenCalledWith(StackActions.push('SeeAll', params));
  });
});
