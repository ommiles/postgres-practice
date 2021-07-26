Rails.application.routes.draw do
  resources :users
  post '/login' => 'auth#login'
  get '/profile' => 'users#profile'
end
