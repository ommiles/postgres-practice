class ApplicationController < ActionController::API
    SECRET = Rails.application.credentials.dig(:secret_key_base)
    # Put the app on lockdown!
    before_action :authorized

    # This action will receive a user’s username... 
    # ... and password through params.
    def login
        # 1. Find a user from the users’ table
        user = User.find_by(username: login_params[:username])
        # 2. If a user is found, it will call the method authenticate on the user instance...
        # ...while passing in the user’s password from params
        if user && user.authenticate(login_params[:password])
            # 3. If there is a user and the user is authenticated...
            # ...we will generate a token for our user...
            # ...and render a json object that has both our user instance and that user’s token.
            token = JWT.encode({ user_id: user.id }, SECRET, 'HS256')
            render json: { user: user, token: token }
        else
            # 4. Otherwise, we can render a json object with an error message. 
            render json: { errors: user.errors.full_messages }
        end
    end

    def authorized
        # 5. Check if the headers in the request have an Authorization key
        if request.headers['Authorization']
            # 6. If it does, then we will grab the token from the headers and decode it,...
            encoded_token = request.headers['Authorization'].split(' ')[1]
            token = JWT.decode(encoded_token, SECRET)
            # ... use it to find the user instance that this token belongs to ...
            user_id = token[0]['user_id']
            user = User.find(user_id)
            # ... and render it as our response.
            render json: user
        else
            render json: { message: "Please log in" }
        end
        # If there is no Authorization key, then this action will do nothing.
    end

    private

    def login_params
        params.permit(:username, :password)
    end

    def encode_token(payload)
        # Using the JWT gem, the encode method takes the payload { username: 'abc' }
        # and our encrypted key(string) as arguments.
        # The jwt will be returned.
        JWT.encode(payload, SECRET)
    end

    def auth_header
        # When we fetch from the client, the token is in the request headers.
        # Retrieve the key 'Authorization' and return in our auth_header helper method
        request.headers['Authorization']
    end

    def decoded_token
        # If there's no auth header in an incoming request...
        # or if auth_header's return value is nil...
        # ... don't run the method below.
        if auth_header 
            token = auth_header.split(' ')[1]
            begin
                # Hash can only be decoded with the correct SECRET and token.
                # Once decoded, we are returned an array of 2 objects:
                # Header object (has algorithm type) and payload object (has user's info).
                JWT.decode(token, SECRET, true, algorithm: "HS256")
            rescue JWT::DecodeError
                # If there's an error, return nil
                nil
            end
        end   
    end

    def current_user
        # If decoded token was not nil,
        # retrieve the user_id from the payload we sent with the fetch.
        if decoded_token
            user_id = decoded_token[0]['user_id']
            # Lookup that user ...
            user = User.find_by(id: user_id)
        end
    end

    def logged_in?
        # Coerce the current_user value to a boolean...
        # ... depending on the presence of a current user.
        !!current_user
    end

    def authorized
        # This is our gatekeeper helper method.
        # If we call authorize method and the user is not logged in, return the below message in JSON to the client.
        render json: {message: "Please log in"}, status: :unauthorized unless logged_in?
    end
end
