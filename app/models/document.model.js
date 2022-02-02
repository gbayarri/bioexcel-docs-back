module.exports = mongoose => {
    const Document = mongoose.model(
      "document",
      mongoose.Schema(
        {
          id: String,
          name: String,
          abstract: String,
          path: String,
          category: String
        },
        { timestamps: true }
      )
    );
  
    return Document;
  };