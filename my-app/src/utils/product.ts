export const addToFavoritesLocalStorage = (product: any) => {
  let favorite = localStorage.getItem('favorite');
  let listFavorite: any[] = favorite ? JSON.parse(favorite) : [];
  // Kiểm tra nếu sản phẩm chưa có trong mục yêu thích thì mới thêm vào
  if (!listFavorite.some((item) => item._id === product._id)) {
    listFavorite.push(product);
    localStorage.setItem('favorite', JSON.stringify(listFavorite));
  }
};
