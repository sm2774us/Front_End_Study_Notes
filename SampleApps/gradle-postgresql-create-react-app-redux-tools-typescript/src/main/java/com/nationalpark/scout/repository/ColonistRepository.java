package com.nationalpark.scout.repository;

import com.nationalpark.scout.models.Colonist;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface ColonistRepository extends CrudRepository<Colonist, Integer> {

}