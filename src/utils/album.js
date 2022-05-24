const mapDbToModel = ({
  id, name, year, inserted_at, updated_at,
}) => ({
  id,
  name,
  year,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { mapDbToModel };
