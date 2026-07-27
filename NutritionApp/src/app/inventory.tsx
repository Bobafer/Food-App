import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const INITIAL_INVENTORY = [
    { id: 'eggs', name: 'Eggs', emoji: '🥚', category: 'Dairy and eggs', quantity: 12, unit: 'count', lowStockAt: 3 },
  { id: 'milk', name: 'Milk', emoji: '🥛', category: 'Dairy and eggs', quantity: 1, unit: 'L', lowStockAt: 0.5 },
  { id: 'spinach', name: 'Spinach', emoji: '🥬', category: 'Produce', quantity: 1, unit: 'bag', lowStockAt: 1 },
  { id: 'bell_peppers', name: 'Bell peppers', emoji: '🫑', category: 'Produce', quantity: 1, unit: 'count', lowStockAt: 2 },
  { id: 'chicken_breast', name: 'Chicken breast', emoji: '🍗', category: 'Meat', quantity: 4, unit: 'count', lowStockAt: 1 },
];

const CATEGORY_ORDER = ['Dairy and eggs', 'Produce','Meat','Pantry'];

export function InventoryScreen({ navigation }) {
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);
    const [activityLog, setActivityLog] = useState([
    'Used 3 eggs and 1 spinach for Spinach and Chicken Salad',
    'Used 2 bell peppers for Frittata',
    ]);

    const adjustQuantity = (id, delta) => {
        setInventory((prev) =>
            prev.map((item) => 
                item.id === id
                    ?{...item, quantity: Math.max(0, +(item.quantity + delta).toFixed (2))}
                        :item
                )
            );
    };


    const useIngredientsForRecipe = (recipeIngredients, recipeName) => {
    setInventory((prev) =>
      prev.map((item) => {
        const used = recipeIngredients.find((r) => r.id === item.id);
        if (!used) return item;
        return { ...item, quantity: Math.max(0, +(item.quantity - used.amountUsed).toFixed(2)) };
      })
    );

    const usedNames = recipeIngredients
      .map((r) => {
        const match = inventory.find((i) => i.id === r.id);
        return match ? `${r.amountUsed} ${match.name.toLowerCase()}` : null;
      })
      .filter(Boolean)
      .join(' and ');
 
    if (usedNames) {
      setActivityLog((prev) => [`Used ${usedNames} for ${recipeName}`, ...prev]);
    }
  };
 
  // Example call, showing how a recipe screen would use this later:
  // useIngredientsForRecipe([{ id: 'eggs', amountUsed: 2 }], 'Veggie Omelet');
 
  const groupedByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    items: inventory.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={22} color="#3F6647" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory</Text>
        <View style={{ width: 22 }} />
      </View>
 
      <ScrollView contentContainerStyle={styles.content}>
        {/* Last scan summary — placeholder until the camera flow feeds real data in */}
        <View style={styles.scanCard}>
          <View style={styles.scanIconWrap}>
            <Ionicons name="cube-outline" size={22} color="#5C8A66" />
          </View>
          <View>
            <Text style={styles.scanTitle}>Last scanned</Text>
            <Text style={styles.scanSubtitle}>2 hours ago · {inventory.length} items detected</Text>
          </View>
        </View>
 
        {groupedByCategory.map((group) => (
          <View key={group.category} style={{ marginBottom: 16 }}>
            <Text style={styles.sectionLabel}>{group.category}</Text>
            <View style={styles.card}>
              {group.items.map((item, index) => {
                const isLow = item.quantity <= item.lowStockAt;
                return (
                  <View key={item.id}>
                    <View style={styles.itemRow}>
                      <View style={styles.itemLeft}>
                        <View style={styles.emojiWrap}>
                          <Text style={{ fontSize: 15 }}>{item.emoji}</Text>
                        </View>
                        <Text style={styles.itemName}>{item.name}</Text>
                      </View>
 
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          onPress={() => adjustQuantity(item.id, item.unit === 'L' ? -0.5 : -1)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons name="remove" size={16} color="#9AA39C" />
                        </TouchableOpacity>
                        <Text style={[styles.itemQuantity, isLow && styles.itemQuantityLow]}>
                          {item.quantity}
                          {item.unit !== 'count' ? ` ${item.unit}` : ''}
                        </Text>
                        <TouchableOpacity
                          onPress={() => adjustQuantity(item.id, item.unit === 'L' ? 0.5 : 1)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons name="add" size={16} color="#9AA39C" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {index < group.items.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
 
        <Text style={styles.sectionLabel}>Recent activity</Text>
        <View style={styles.activityCard}>
          {activityLog.length === 0 ? (
            <Text style={styles.emptyText}>No recipes made yet</Text>
          ) : (
            activityLog.map((entry, i) => (
              <View key={i} style={styles.activityRow}>
                <Ionicons name="restaurant-outline" size={14} color="#5C8A66" />
                <Text style={styles.activityText}>{entry}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#EAF3EA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3F6647',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F3F6F2',
    borderRadius: 12,
    padding: 10,
    marginBottom: 18,
  },
  scanIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#DCE6DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22331F',
  },
  scanSubtitle: {
    fontSize: 11,
    color: '#8B948A',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9AA39C',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E9E3',
    borderRadius: 14,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emojiWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F3F6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 13,
    color: '#22331F',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: '500',
    color: '#22331F',
    minWidth: 34,
    textAlign: 'center',
  },
  itemQuantityLow: {
    color: '#A32D2D',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF1EC',
    marginLeft: 14,
  },
  activityCard: {
    borderWidth: 1,
    borderColor: '#E5E9E3',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityText: {
    fontSize: 12,
    color: '#5F6B5F',
    flex: 1,
  },
  emptyText: {
    fontSize: 12,
    color: '#9AA39C',
  },
});

