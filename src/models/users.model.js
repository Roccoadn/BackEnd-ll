import mongoose, { Schema } from "mongoose";

const userSchema = new Schema ({
    first_name: { type: String, required: true
    },
    last_name: { type: String, required: true 
    },
    email: { type: String, unique: true, required: true    
    },
    age: { type: Number, required: true 
    },
    password: { type: String, required: true 
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' 
    },
    role: { type: String, default: 'user' 
    }
  });
  
  const User = mongoose.model('user', userSchema);
  export default User;