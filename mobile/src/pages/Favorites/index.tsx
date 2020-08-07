import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState([]);

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);

        setFavorites(favoritedTeachers);
      }
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []),
  );

  return (
    <View style={styles.container}>
      <PageHeader title="Meus proffys favoritos"></PageHeader>

      {favorites.length > 0 ? (
        <ScrollView
          style={styles.teacherList}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        >
          {favorites.map((teacher: Teacher) => {
            return (
              <TeacherItem
                key={teacher.id}
                teacher={teacher}
                favorited
              ></TeacherItem>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Nenhum professor favoritado.</Text>
        </View>
      )}
    </View>
  );
};

export default Favorites;
