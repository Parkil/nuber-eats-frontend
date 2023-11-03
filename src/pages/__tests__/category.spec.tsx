import {render, screen} from "@testing-library/react";
import {Category} from "../client/category";


jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom')
  return {
    ...realModule,
    useParams: () => {
      return {
        slug: 'test-slug'
      }
    }
  }
})

jest.mock('../../components/restaurant/restaurant.category.list')

describe('<Category/>', () => {
  it('should render ok', () => {
    render(<Category/>)
  });
});
