import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Example data, standing in for what the camera scan will eventually produce ---
// Once the camera/detection step is built, this initial state should instead come
// from that result (e.g. navigation params, or a store/context updated after a scan).

// This is what will appear on the screen at default
const INITIAL_INVENTORY = [
  { id: 'eggs', name: 'Eggs', category: 'Dairy and eggs', quantity: 12, unit: 'count', lowStockAt: 3 },
  { id: 'milk', name: 'Milk', category: 'Dairy and eggs', quantity: 1, unit: 'L', lowStockAt: 0.5 },
  { id: 'spinach', name: 'Spinach', category: 'Produce', quantity: 1, unit: 'bag', lowStockAt: 1 },
  { id: 'bell_peppers', name: 'Bell peppers', category: 'Produce', quantity: 1, unit: 'count', lowStockAt: 2 },
  { id: 'chicken_breast', name: 'Chicken breast', category: 'Meat', quantity: 4, unit: 'count', lowStockAt: 1 },
];

const CATEGORY_ORDER = ['Dairy and eggs', 'Produce', 'Meat', 'Pantry', 'Other'];

// --- One minimalist outline icon per category — every item in that category shares it ---
const CATEGORY_META = {
  'Dairy and eggs': { IconSet: MaterialCommunityIcons, icon: 'egg-outline', bg: '#E1EDF7', color: '#2E6FA3' },
  Produce: { IconSet: Ionicons, icon: 'leaf-outline', bg: '#EAF3DE', color: '#3B6D11' },
  Meat: { IconSet: MaterialCommunityIcons, icon: 'food-drumstick-outline', bg: '#FBF1D6', color: '#A67C00' },
  Pantry: { IconSet: MaterialCommunityIcons, icon: 'archive-outline', bg: '#F1EFE8', color: '#5F5E5A' },
  Other: { IconSet: Ionicons, icon: 'help-circle-outline', bg: '#F1EFE8', color: '#5F5E5A' },
};

// --- Lookup used to auto-categorize a manually typed food name ---
// Not exhaustive, but covers the common cases. Anything not found here falls back
// to whichever category chip the person has selected in the add-item form.
const FOOD_CATEGORY_MAP = {
  // Produce
  apple: 'Produce', banana: 'Produce', orange: 'Produce', grapes: 'Produce', strawberries: 'Produce',
  blueberries: 'Produce', raspberries: 'Produce', lettuce: 'Produce', spinach: 'Produce', kale: 'Produce',
  tomato: 'Produce', tomatoes: 'Produce', cucumber: 'Produce', carrot: 'Produce', carrots: 'Produce',
  potato: 'Produce', potatoes: 'Produce', 'sweet potato': 'Produce', onion: 'Produce', onions: 'Produce',
  garlic: 'Produce', 'bell pepper': 'Produce', 'bell peppers': 'Produce', broccoli: 'Produce',
  cauliflower: 'Produce', zucchini: 'Produce', avocado: 'Produce', lemon: 'Produce', lime: 'Produce',
  mushroom: 'Produce', mushrooms: 'Produce', celery: 'Produce', corn: 'Produce', peas: 'Produce',
  'green beans': 'Produce', cabbage: 'Produce', pumpkin: 'Produce', squash: 'Produce', cilantro: 'Produce',
  parsley: 'Produce', basil: 'Produce', mint: 'Produce', ginger: 'Produce', watermelon: 'Produce',
  pineapple: 'Produce', mango: 'Produce', peach: 'Produce', pear: 'Produce', plum: 'Produce',
  cherries: 'Produce', kiwi: 'Produce', pomegranate: 'Produce', asparagus: 'Produce', beets: 'Produce',
  radish: 'Produce', eggplant: 'Produce',

  // Dairy and eggs
  eggs: 'Dairy and eggs', egg: 'Dairy and eggs', milk: 'Dairy and eggs', butter: 'Dairy and eggs',
  cheese: 'Dairy and eggs', 'cheddar cheese': 'Dairy and eggs', mozzarella: 'Dairy and eggs',
  'cream cheese': 'Dairy and eggs', yogurt: 'Dairy and eggs', 'greek yogurt': 'Dairy and eggs',
  'sour cream': 'Dairy and eggs', 'heavy cream': 'Dairy and eggs', 'cottage cheese': 'Dairy and eggs',
  parmesan: 'Dairy and eggs', 'half and half': 'Dairy and eggs', 'whipped cream': 'Dairy and eggs',

  // Meat
  'chicken breast': 'Meat', 'chicken thigh': 'Meat', chicken: 'Meat', 'ground beef': 'Meat',
  steak: 'Meat', 'pork chop': 'Meat', bacon: 'Meat', sausage: 'Meat', turkey: 'Meat', ham: 'Meat',
  salmon: 'Meat', tuna: 'Meat', shrimp: 'Meat', 'ground turkey': 'Meat', lamb: 'Meat', ribs: 'Meat',
  'hot dogs': 'Meat', fish: 'Meat',

  // Pantry
  rice: 'Pantry', pasta: 'Pantry', flour: 'Pantry', sugar: 'Pantry', salt: 'Pantry', pepper: 'Pantry',
  'olive oil': 'Pantry', 'vegetable oil': 'Pantry', bread: 'Pantry', cereal: 'Pantry', oats: 'Pantry',
  beans: 'Pantry', 'canned tomatoes': 'Pantry', 'peanut butter': 'Pantry', jam: 'Pantry', honey: 'Pantry',
  vinegar: 'Pantry', 'soy sauce': 'Pantry', ketchup: 'Pantry', mustard: 'Pantry', mayonnaise: 'Pantry',
  'baking powder': 'Pantry', 'baking soda': 'Pantry', 'chocolate chips': 'Pantry', nuts: 'Pantry',
  crackers: 'Pantry', tortillas: 'Pantry',
};
// Sees what the food's added catagory is
function guessCategory(name) {
  const key = name.trim().toLowerCase();
  return FOOD_CATEGORY_MAP[key] || null;
}
// Sorts it and puts it in other if it can not find it
function CategoryIcon({ category, size = 15 }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;
  const { IconSet, icon, color } = meta;
  return <IconSet name={icon} size={size} color={color} />;
}

export function InventoryScreen() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [activityLog, setActivityLog] = useState([
    'Used 3 eggs and 1 spinach for Spinach and Chicken Salad',
    'Used 2 bell peppers for Frittata',
  ]);

  // --- Manual add-item form state ---
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('1');
  const [newUnit, setNewUnit] = useState('count');
  const [newCategory, setNewCategory] = useState('Produce');

  // Manual +/- stepper, for correcting a miscount from the scan
  const adjustQuantity = (id, delta) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, +(item.quantity + delta).toFixed(2)) }
          : item
      )
    );
  };

  // Item currently pending delete confirmation, e.g. { id: 'eggs', name: 'Eggs' }.
  // Holding this in state (rather than using Alert.alert / window.confirm) lets us
  // render a custom in-app confirmation modal that works the same on web and native.
  const [pendingDelete, setPendingDelete] = useState(null);

  const requestDeleteItem = (id, name) => {
    setPendingDelete({ id, name });
  };

  const confirmDeleteItem = () => {
    if (!pendingDelete) return;
    setInventory((prev) => prev.filter((item) => item.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const cancelDeleteItem = () => {
    setPendingDelete(null);
  };

  // Call this when a recipe is made. recipeIngredients looks like:
  // [{ id: 'eggs', amountUsed: 3 }, { id: 'spinach', amountUsed: 1 }]
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

  // Auto-suggest a category as the user types, if the name matches something we know
  const handleNameChange = (text) => {
    setNewName(text);
    const guessed = guessCategory(text);
    if (guessed) setNewCategory(guessed);
  };

  const addManualItem = () => {
    const trimmed = newName.trim();
    if (trimmed.length === 0) return;

    const qty = parseFloat(newQuantity);
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
    const id = `${trimmed.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    setInventory((prev) => [
      ...prev,
      {
        id,
        name: trimmed,
        category: newCategory,
        quantity: safeQty,
        unit: newUnit.trim() || 'count',
        lowStockAt: 1,
      },
    ]);

    setNewName('');
    setNewQuantity('1');
    setNewUnit('count');
  };

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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                          <View style={[styles.iconWrap, { backgroundColor: (CATEGORY_META[item.category] || CATEGORY_META.Other).bg }]}>
                            <CategoryIcon category={item.category} />
                          </View>
                          <Text style={styles.itemName}>{item.name}</Text>
                        </View>

                        <View style={styles.itemRight}>
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

                          <TouchableOpacity
                            onPress={() => requestDeleteItem(item.id, item.name)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={styles.deleteButton}
                          >
                            <Ionicons name="trash-outline" size={16} color="#C4746C" />
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

          {/* --- Manual add — for anything the AI scan missed --- */}
          <Text style={styles.sectionLabel}>Add missed item</Text>
          <View style={styles.addCard}>
            <View style={styles.categoryChipRow}>
              {CATEGORY_ORDER.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, newCategory === cat && styles.categoryChipActive]}
                  onPress={() => setNewCategory(cat)}
                >
                  <CategoryIcon category={cat} size={13} />
                  <Text style={[styles.categoryChipText, newCategory === cat && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.nameInput}
              placeholder="Food name, e.g. Cucumber"
              placeholderTextColor="#9AA39C"
              value={newName}
              onChangeText={handleNameChange}
              returnKeyType="done"
              autoCapitalize="words"
              autoCorrect={false}
            />

            <View style={styles.addRow}>
              <View style={styles.smallInputWrap}>
                <Text style={styles.smallInputLabel}>Qty</Text>
                <TextInput
                  style={styles.smallInput}
                  value={newQuantity}
                  onChangeText={(t) => setNewQuantity(t.replace(/[^0-9.]/g, ''))}
                  keyboardType="decimal-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.smallInputWrap}>
                <Text style={styles.smallInputLabel}>Unit</Text>
                <TextInput
                  style={styles.smallInput}
                  value={newUnit}
                  onChangeText={setNewUnit}
                  placeholder="count"
                  placeholderTextColor="#9AA39C"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={addManualItem} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom confirm-delete modal — avoids Alert.alert (native-only, no-ops on
          web) and window.confirm (shows as a jarring browser-chrome popup). */}
      <Modal
        visible={!!pendingDelete}
        transparent
        animationType="fade"
        onRequestClose={cancelDeleteItem}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="trash-outline" size={22} color="#C4746C" />
            </View>
            <Text style={styles.modalTitle}>Remove item?</Text>
            <Text style={styles.modalMessage}>
              {pendingDelete
                ? `${pendingDelete.name} will be removed from your inventory.`
                : ''}
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelDeleteItem}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmDeleteItem}
              >
                <Text style={styles.modalButtonConfirmText}>Yes, remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
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
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
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
  deleteButton: {
    padding: 2,
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
    marginBottom: 20,
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
  addCard: {
    borderWidth: 1,
    borderColor: '#E5E9E3',
    borderRadius: 14,
    padding: 14,
  },
  categoryChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#F3F6F2',
  },
  categoryChipActive: {
    backgroundColor: '#6FA377',
  },
  categoryChipText: {
    fontSize: 11,
    color: '#5F6B5F',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#E5E9E3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#22331F',
    marginBottom: 10,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  smallInputWrap: {
    flex: 1,
  },
  smallInputLabel: {
    fontSize: 10,
    color: '#9AA39C',
    marginBottom: 4,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#E5E9E3',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
    color: '#22331F',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6FA377',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 30, 20, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FCEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#22331F',
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 12,
    color: '#5F6B5F',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F6F2',
  },
  modalButtonCancelText: {
    color: '#5F6B5F',
    fontSize: 13,
    fontWeight: '600',
  },
  modalButtonConfirm: {
    backgroundColor: '#C4746C',
  },
  modalButtonConfirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});