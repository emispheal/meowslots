


from collections import Counter

import random 


letter_pay = 0.25

payouts = {
    'L1' : {'2' : letter_pay, '3' : letter_pay*2},
    'L2' : {'2' : letter_pay, '3' : letter_pay*2},
    'L3' : {'2' : letter_pay, '3' : letter_pay*2},
    'L4' : {'2' : letter_pay, '3' : letter_pay*2},
    'H1' : {'2' : letter_pay*4, '3' : letter_pay*8},
    'J1' : {'2' : letter_pay*12, '3' : letter_pay*16},
}


tile_weights = {
    'L1' : 40,
    'L2' : 40,
    'L3' : 40,
    'L4' : 40,
    'H1' : 20,
    'J1' : 1,
    'W' : 50,
    'B' : 10
}

def weighted_random_selection(items_with_weights):
    # Create a list of items and a corresponding list of their weights
    items = list(items_with_weights.keys())
    weights = list(items_with_weights.values())

    # Use random.choices() to select an item based on weights
    selected_item = random.choices(items, weights=weights, k=1)[0]
    return selected_item

def extract_payline(board, c1, c2, c3):
    payline = [board[c1[0]][c1[1]], board[c2[0]][c2[1]], board[c3[0]][c3[1]]]
    return payline
    

def calc_payline_multi(payline):
    # check 3 bonus first (bc no wildcard allowed)
    count = Counter(payline)
    p0, p1, p2 = payline[0], payline[1], payline[2]
    num_W = payline.count('W')

    if num_W == 3:
        return 0
    if p0 == p1 == p2 == 'B':
        return '6B'
    # 2 bonus
    elif p0 == p1 == 'B':
        return '3B'
    # 3 match with 2 wildcard
    elif (num_W == 2):
        for element, frequency in count.items():
            if frequency == 1:
                if element == 'B':
                    return 0
                return payouts[element]['2']
                
        
    # one wildcard (unknown match)
    elif (num_W == 1):
        # one wildcard, and 2 of the same
        for element, frequency in count.items():
            if frequency == 2:
                if element == 'B': # refactor later lol
                    return 0
                return payouts[element]['3']
        
        if p2 == 'W':
            # no payout wildcard on the last cant form a chain
            return 0 
        else:
            # ['W', 'A', 'B'] A Win
            # ['A', 'W', 'B'] A Win
             for symbol in payline:
                if symbol != 'W':
                    if symbol == 'B':
                        return 0
                    return payouts[symbol]['2']
    # no match
    else:
        for element, frequency in count.items():
            if frequency == 2:
                if p0 == p1 == element:
                    return payouts[element]['2']
            elif frequency == 3:
                return payouts[element]['3']
        return 0

def spawn_board():
    # Create a 3x3 array
    board = [[weighted_random_selection(tile_weights) for _ in range(3)] for _ in range(3)]
    return board


paylines = [
    # top horiz line
    [(0, 0), (1, 0), (2, 0)],
    # mid horiz lie
    [(0, 1), (1, 1), (2, 1)],
    # bot horiz line
    [(0, 2), (1, 2), (2, 2)],
    # top left to bot right diag line
    [(0, 0), (1, 1), (2, 2)],
    # bot left to top right diag line
    [(0, 2), (1, 1), (2, 0)],
]
    
    
    

def simulate_spin(bet_num):
    cur_spins = 1
    total_payout = 0
    while cur_spins > 0:
        board = spawn_board()
        print(board)
        
        for line in paylines:
            c1, c2, c3 = line[0], line[1], line[2]
            line_result = extract_payline(board, c1, c2, c3)
            multi_result = calc_payline_multi(line_result)
            if multi_result == '6B':
                cur_spins += 6
            elif multi_result == '3B':
                cur_spins += 3
            else:
                total_payout += multi_result * bet_num

        cur_spins -= 1    
    
    print(total_payout)

    return total_payout

# for _ in range(1, 10):
#     # selected_item = weighted_random_selection(tile_weights)
#     # print(selected_item)
#     print(spawn_board())

# line1 = ['B', 'B', 'B']
# print(calc_payline_multi(line1))

# print()

i = 0
total_play_payout = 0
for _ in range (1, 100001):
    total_play_payout += simulate_spin(10)
    i += 1

print("total play", total_play_payout, "rounds played", i)
    