import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';
import PetitionDescription from '../../application/components/PetitionDescription/PetitionDescription';
import LinkButton from '../../application/components/LinkButton/LinkButton';

Enzyme.configure({ adapter: new Adapter() });

describe('PetitionDescription', () => {
  const description = 'a'.repeat(150);

  it('should initially show a partial description and a "Read more" button', () => {
    const wrapper = shallow(<PetitionDescription description={description} />);

    const partialDescription = wrapper.find({ id: 'description-text' }).props().html;
    const descriptionWithoutEllipsis = partialDescription.replace('&hellip;', '');
    expect(descriptionWithoutEllipsis).toHaveLength(100);

    const readMoreButton = wrapper.find(LinkButton).findWhere(b => b.props().name === 'Read more');
    expect(readMoreButton).toHaveLength(1);
  });

  it('should show a full description after clicking "Read more"', () => {
    const wrapper = shallow(<PetitionDescription description={description} />);

    const readMoreButton = wrapper.find(LinkButton).findWhere(b => b.props().name === 'Read more');
    readMoreButton.props().onPress();

    wrapper.update();

    const fullDescription = wrapper.find({ id: 'description-text' }).props().html;
    expect(fullDescription).toHaveLength(150);
  });
});