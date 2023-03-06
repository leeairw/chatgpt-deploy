interface Message {
    text: string;
    createdAt: admin.firestore.Timestamp;
    user: {
        _id: string;
        name: string;
        type: string;
        user_choices: string[];
        user_action: string;
        avatar: string;
    };
};