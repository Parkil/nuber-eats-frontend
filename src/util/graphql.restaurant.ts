type paramType = {
  id: number,
  name: string,
  coverImg: string,
  categoryName: string,
  categorySlug: string,
  address: string,
};
export const getSingleObject = (param: paramType) => {
  return {
    "__typename": "Restaurant",
    "id": param.id,
    "name": param.name,
    "coverImg": param.coverImg,
    "category": {
      "__typename": "Category",
      "name": param.categoryName,
      "slug": param.categorySlug
    },
    "address": param.address,
    "isPromoted": false
  }
}
