import api from './config'

export default {

// HomeView.vue:

smuckaj: (data) => api.post('searchbar/searchByIngredient', data),
pretrazi: (data) => api.post('searchbar/recipeSearch', data),
filteredSearch: (data) => api.post('searchbar/searchFiltered', data),
getMostFav: (data) => api.post('searchbar/mostFavs', data),

//RecipesView.vue:
receptiPrikaz: (data) => api.post('searchbar/recipeSearch', data),
mojiReceptiPrikaz: (data) => api.post('searchbar/searchMyRecipe', data),
mojiFavoritiPrikaz: (data) => api.post('searchbar/searchFavorites', data),
readRec: (data) => api.post('recipe/readRecipe', data),
//DishesView.vue:
jelaPrikaz: (data) => api.get('dish/readDish', data),

//auth
register: (params) => api.post('auth/register', params),
login: (data) => api.post('auth/login', data),
logout: (id) => api.post('auth/logout', id),
validate:(sid) => api.post('auth/validate', sid ),

//admin
prikazReportedRec: (data) => api.get('admin/viewReportRecipe', data),
prikazReportedUsr: (data) => api.get('admin/viewReportUser', data),
getCategory: () => api.get('dish/readDish'),
IngAndMeasure: () => api.get('ingredients/sendIngAndMeasure'),
imgHandle: (data) =>
  api.post('image/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
createRec: (data) =>
  api.post('recipe/createRecipe', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
editRecipe: (data) =>
  api.put('recipe/editRecipe', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
deleteRecipe: (data) =>
  api.put('recipe/deleteRecipe', data),
postComment: (data) =>
  api.post('comment/postComment', data),
readComment: (data) =>
  api.post('comment/readOnRecipe', data),
deleteComment: (data) =>
  api.put('comment/deleteComment', data),
readUser: (data) =>
  api.post('user/readUser', data),
editUser: (data) =>
  api.put('user/editUser', data),
deleteUser: (data) =>
  api.put('user/deleteUser', data),
deleteReport: (data) =>
  api.put('admin/deleteReport', data),

editIng: (data) => api.put('ingredients/editIng', data),
createIng: (data) => api.post('ingredients/createIng', data),
deleteIng: (data) => api.put('ingredients/deleteIng', data),

editDish: (data) => api.put('dish/editDish', data),
createDish: (data) => api.post('dish/createDish', data),
deleteDish: (data) => api.put('dish/deleteDish', data),

reportRec: (data) => api.post('report/reportRecipe', data),
reportUser: (data) => api.post('report/reportUser', data),

addToFavs: (data) => api.post('favorites/addFavorite', data),
removeFromFavs: (data) => api.put('favorites/removeFavorite', data),
checkFavs: (data) => api.post('favorites/checkFavorite', data),


}
