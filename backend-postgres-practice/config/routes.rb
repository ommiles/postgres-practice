Rails.application.routes.draw do
  resources :users
  post '/login' => 'auth#login'
  get '/get_user' => 'users#get_user'
end
