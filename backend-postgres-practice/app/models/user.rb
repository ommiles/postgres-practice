class User < ApplicationRecord
    # This method provides us with a number of methods...
    # ... to set up and authenticate user passwords with bcrypt.
    validates :username, uniqueness: true
    has_secure_password
end
